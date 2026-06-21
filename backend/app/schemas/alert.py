from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.alert import AlertType, AlertStatus

class AlertResponse(BaseModel):
    id: int
    monitor_id: int
    monitor_name: str
    alert_type: AlertType
    status: AlertStatus
    message: str
    whatsapp_number: str
    error_details: Optional[str] = None
    created_at: datetime
    sent_at: Optional[datetime] = None

    class Config:
        from_attributes = True