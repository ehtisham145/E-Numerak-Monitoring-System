import httpx
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.monitor import Monitor, MonitorStatus
from app.models.alert import Alert, AlertType, AlertStatus
from app.utils.config import GREEN_API_INSTANCE_ID,GREEN_API_TOKEN,GREEN_API_URL
from datetime import timezone

async def send_whatsapp_alert(phone_number: str, message: str) -> bool:
    try:
        url = f"{GREEN_API_URL}/waInstance{GREEN_API_INSTANCE_ID}/sendMessage/{GREEN_API_TOKEN}"

        payload = {
            "chatId": f"{phone_number}@c.us",
            "message": message
        }

        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(url, json=payload)

            if response.status_code == 200:
                print(f"WhatsApp alert sent successfully: {phone_number}")
                return True
            else:
                print(f"WhatsApp alert failed: {response.text}")
                return False

    except Exception as e:
        print(f"WhatsApp error: {str(e)}")
        return False


def build_down_message(monitor: Monitor, check_result: dict, timestamp: str) -> str:
    error_detail = check_result.get("error_message") or "No additional details available."
    response_time = check_result.get("response_time_ms")
    response_time_str = f"{response_time:.0f} ms" if response_time is not None else "N/A"
    previous_status = check_result["old_status"].value.upper()

    return (
        "*SERVICE DOWN ALERT*\n\n"
        f"Service: {monitor.name}\n"
        f"URL: {monitor.url}\n"
        f"Previous Status: {previous_status}\n"
        f"Current Status: DOWN\n"
        f"Response Time: {response_time_str}\n"
        f"Issue: Server is not accepting requests\n"
        f"Detected At: {timestamp} UTC\n\n"
        "This service is currently unreachable or not responding as expected. "
        "Immediate attention is required to restore normal operation.\n\n"
        "— E-numerak Monitoring System"
    )


def build_up_message(monitor: Monitor, check_result: dict, timestamp: str) -> str:
    response_time = check_result.get("response_time_ms")
    response_time_str = f"{response_time:.0f} ms" if response_time is not None else "N/A"

    return (
        "*SERVICE RESTORED*\n\n"
        f"Service: {monitor.name}\n"
        f"URL: {monitor.url}\n"
        f"Previous Status: DOWN\n"
        f"Current Status: UP\n"
        f"Response Time: {response_time_str}\n"
        f"Restored At: {timestamp} UTC\n\n"
        "The service is responding normally again. No further action is required at this time.\n\n"
        "— E-numerak Monitoring System"
    )


async def process_alerts(check_result: dict, monitor: Monitor, db: AsyncSession):
    # Only send an alert when the status has actually changed.
    if check_result["old_status"] == check_result["new_status"]:
        return

    if not monitor.alert_on_down:
        return

    if not monitor.alert_whatsapp_numbers:
        return

    # A single UTC-aware timestamp is used for both the message text and the
    # database record, so they always stay in agreement.
    now_utc = datetime.now(timezone.utc)
    timestamp = now_utc.strftime("%Y-%m-%d %H:%M:%S")

    if check_result["new_status"] == MonitorStatus.DOWN:
        alert_type = AlertType.DOWN
        message = build_down_message(monitor, check_result, timestamp)
    elif check_result["new_status"] == MonitorStatus.UP:
        alert_type = AlertType.UP
        message = build_up_message(monitor, check_result, timestamp)
    else:
        return

    numbers = [n.strip() for n in monitor.alert_whatsapp_numbers.split(",")]

    for number in numbers:
        if not number:
            continue

        success = await send_whatsapp_alert(number, message)

        alert = Alert(
            monitor_id=monitor.id,
            monitor_name=monitor.name,
            alert_type=alert_type,
            status=AlertStatus.SENT if success else AlertStatus.FAILED,
            message=message,
            whatsapp_number=number,
            sent_at=now_utc if success else None
        )
        db.add(alert)

    await db.commit()