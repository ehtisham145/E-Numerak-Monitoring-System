from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from sqlalchemy import select
from app.db.database import AsyncSessionLocal
from app.models.monitor import Monitor
from app.core.monitor_engine import check_single_monitor
from app.core.alert_engine import process_alerts
from app.utils.config import CHECK_INTERVAL_SECONDS
from datetime import datetime

scheduler = AsyncIOScheduler()


async def run_monitoring_job():
    print(f"\n🔍 [{datetime.now()}] Monitoring Job is Running...")

    async with AsyncSessionLocal() as db:
        try:
            result = await db.execute(
                select(Monitor).where(Monitor.is_active == True)
            )
            monitors = result.scalars().all()

            if not monitors:
                print("⚠️ No Memeber is Active !")
                return

            for monitor in monitors:
                check_result = await check_single_monitor(monitor, db)
                await process_alerts(check_result, monitor, db)
                print(f"{'✅' if check_result['new_status'] == 'up' else '❌'} {monitor.name} — {check_result['new_status']}")

        except Exception as e:
            print(f"❌ Monitoring error: {str(e)}")



async def start_scheduler():
    scheduler.add_job(
        run_monitoring_job,
        trigger=IntervalTrigger(seconds=CHECK_INTERVAL_SECONDS),
        id="monitoring_job",
        replace_existing=True
    )
    scheduler.start()
    print(f"Scheduler started! Every {CHECK_INTERVAL_SECONDS} second it will check!")

async def stop_scheduler():
    scheduler.shutdown()
    print("Scheduler has been close!")