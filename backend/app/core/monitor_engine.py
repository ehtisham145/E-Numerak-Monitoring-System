import httpx
import time
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.monitor import Monitor, MonitorStatus
from app.models.log import Log, LogStatus


async def check_single_monitor(monitor: Monitor, db: AsyncSession) -> dict:
    start_time = time.time()
    status = LogStatus.FAILURE
    status_code = None
    error_message = None
    response_time_ms = None

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(str(monitor.url))
            response_time_ms = (time.time() - start_time) * 1000
            status_code = response.status_code

            if response.status_code == monitor.expected_status_code:
                status = LogStatus.SUCCESS
            else:
                status = LogStatus.FAILURE
                error_message = f"Expected {monitor.expected_status_code}, found {response.status_code}"

    except httpx.TimeoutException:
        response_time_ms = (time.time() - start_time) * 1000
        status = LogStatus.TIMEOUT
        error_message = "Request has been time out !"

    except Exception as e:
        response_time_ms = (time.time() - start_time) * 1000
        status = LogStatus.FAILURE
        error_message = str(e)

    # Log save karo
    log = Log(
        monitor_id=monitor.id,
        monitor_name=monitor.name,
        status=status,
        response_time_ms=response_time_ms,
        status_code=status_code,
        error_message=error_message,
        checked_at=datetime.utcnow()
    )
    db.add(log)

    # Monitor status update karo
    old_status = monitor.status
    if status == LogStatus.SUCCESS:
        monitor.status = MonitorStatus.UP
    else:
        monitor.status = MonitorStatus.DOWN

    monitor.response_time_ms = response_time_ms
    monitor.last_checked_at = datetime.now()

    await db.commit()

    return {
        "monitor_id": monitor.id,
        "monitor_name": monitor.name,
        "old_status": old_status,
        "new_status": monitor.status,
        "status": status,
        "response_time_ms": response_time_ms,
        "error_message": error_message
    }