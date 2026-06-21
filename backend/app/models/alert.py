from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.sql import func
import enum
from app.db.database import Base

class AlertType(str, enum.Enum):
    DOWN = "down"
    UP = "up"
    SLOW = "slow"
    ERROR = "error"

class AlertStatus(str, enum.Enum):
    SENT = "sent"
    FAILED = "failed"
    PENDING = "pending"

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    monitor_id = Column(Integer, ForeignKey("monitors.id"), nullable=False)
    monitor_name = Column(String(255), nullable=False)
    alert_type = Column(Enum(AlertType), nullable=False)
    status = Column(Enum(AlertStatus), default=AlertStatus.PENDING)
    message = Column(Text, nullable=False)
    whatsapp_number = Column(String(20), nullable=False)
    error_details = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    sent_at = Column(DateTime, nullable=True)