from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.db.database import get_db
from app.models.monitor import Monitor, MonitorStatus
from app.models.alert import Alert
from app.models.log import Log

router = APIRouter()


@router.get("/stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    # Total monitors
    total = await db.execute(select(func.count(Monitor.id)))
    total_monitors = total.scalar()

    # Up monitors
    up = await db.execute(
        select(func.count(Monitor.id)).where(Monitor.status == MonitorStatus.UP)
    )
    up_monitors = up.scalar()

    # Down monitors
    down = await db.execute(
        select(func.count(Monitor.id)).where(Monitor.status == MonitorStatus.DOWN)
    )
    down_monitors = down.scalar()

    # Total alerts
    alerts = await db.execute(select(func.count(Alert.id)))
    total_alerts = alerts.scalar()

    # Total logs
    logs = await db.execute(select(func.count(Log.id)))
    total_logs = logs.scalar()

    return {
        "total_monitors": total_monitors,
        "up_monitors": up_monitors,
        "down_monitors": down_monitors,
        "total_alerts": total_alerts,
        "total_logs": total_logs,
    }