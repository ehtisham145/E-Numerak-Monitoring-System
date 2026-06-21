from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.monitor import MonitorType,MonitorStatus


class MonitorCreate(BaseModel):
    name: str
    url: str
    monitor_type: MonitorType = MonitorType.HTTP
    expected_status_code: int = 200
    alert_on_down: bool = True
    alert_whatsapp_numbers: str = ""


class MonitorUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[str] = None
    is_active: Optional[bool] = None
    alert_whatsapp_numbers: Optional[str] = None

class MonitorResponse(MonitorCreate):
    id: int
    status: MonitorStatus
    is_active: bool
    response_time_ms: Optional[float] = None
    last_checked_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True