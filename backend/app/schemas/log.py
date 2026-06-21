from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.log import LogStatus

class LogResponse(BaseModel):
    id: int
    monitor_id: int
    monitor_name: str
    status: LogStatus
    response_time_ms: Optional[float] = None
    status_code: Optional[int] = None
    error_message: Optional[str] = None
    checked_at: datetime

    class Config:
        from_attributes = True