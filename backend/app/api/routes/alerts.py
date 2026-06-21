from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db.database import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertResponse

router = APIRouter()


@router.get("/", response_model=List[AlertResponse])
async def get_all_alerts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Alert).order_by(Alert.created_at.desc()))
    return result.scalars().all()


@router.get("/monitor/{monitor_id}", response_model=List[AlertResponse])
async def get_monitor_alerts(monitor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Alert)
        .where(Alert.monitor_id == monitor_id)
        .order_by(Alert.created_at.desc())
    )
    return result.scalars().all()


@router.delete("/clear")
async def clear_all_alerts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Alert))
    alerts = result.scalars().all()
    for alert in alerts:
        await db.delete(alert)
    await db.commit()
    return {"message": "Saare alerts clear ho gaye!"}