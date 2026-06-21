from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.db.database import get_db
from app.models.log import Log
from app.schemas.log import LogResponse

router = APIRouter()


@router.get("/", response_model=List[LogResponse])
async def get_all_logs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Log).order_by(Log.checked_at.desc()).limit(100)
    )
    return result.scalars().all()


@router.get("/monitor/{monitor_id}", response_model=List[LogResponse])
async def get_monitor_logs(monitor_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Log)
        .where(Log.monitor_id == monitor_id)
        .order_by(Log.checked_at.desc())
        .limit(50)
    )
    return result.scalars().all()