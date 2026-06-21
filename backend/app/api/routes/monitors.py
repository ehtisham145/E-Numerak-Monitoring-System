from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from app.db.database import get_db
from app.models.monitor import Monitor
from app.schemas.monitor import MonitorCreate, MonitorUpdate, MonitorResponse

router = APIRouter()


@router.get("/", response_model=List[MonitorResponse])
async def get_all_monitors(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Monitor).order_by(Monitor.created_at.desc()))
    return result.scalars().all()


@router.get("/{monitor_id}", response_model=MonitorResponse)
async def get_monitor(monitor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Monitor).where(Monitor.id == monitor_id))
    monitor = result.scalar_one_or_none()
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor nahi mila!")
    return monitor


@router.post("/", response_model=MonitorResponse)
async def create_monitor(data: MonitorCreate, db: AsyncSession = Depends(get_db)):
    monitor = Monitor(**data.model_dump())
    db.add(monitor)
    await db.commit()
    await db.refresh(monitor)
    return monitor


@router.put("/{monitor_id}", response_model=MonitorResponse)
async def update_monitor(monitor_id: int, data: MonitorUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Monitor).where(Monitor.id == monitor_id))
    monitor = result.scalar_one_or_none()
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor nahi mila!")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(monitor, key, value)
    await db.commit()
    await db.refresh(monitor)
    return monitor


@router.delete("/{monitor_id}")
async def delete_monitor(monitor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Monitor).where(Monitor.id == monitor_id))
    monitor = result.scalar_one_or_none()
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor nahi mila!")
    await db.delete(monitor)
    await db.commit()
    return {"message": "Monitor delete ho gaya!"}


@router.patch("/{monitor_id}/toggle")
async def toggle_monitor(monitor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Monitor).where(Monitor.id == monitor_id))
    monitor = result.scalar_one_or_none()
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor nahi mila!")
    monitor.is_active = not monitor.is_active
    await db.commit()
    return {"message": f"Monitor {'active' if monitor.is_active else 'inactive'} ho gaya!"}