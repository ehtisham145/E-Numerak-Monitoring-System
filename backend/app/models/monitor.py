from sqlalchemy import Column,Integer,String,Boolean,DateTime,Float,Enum
from sqlalchemy.sql import func
import enum
from app.db.database import Base

class MonitorType(str,enum.Enum):
    HTTP = "http"
    API = "api"
    INVOICE = "invoice"

class MonitorType(str, enum.Enum):
    HTTP = "http"
    API = "api"
    INVOICE = "invoice"

class MonitorStatus(str, enum.Enum):
    UP = "up"
    DOWN = "down"
    UNKNOWN = "unknown"


class Monitor(Base):
    __tablename__="monitors"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String(255),nullable=False)
    url =  Column(String(500),nullable=False)
    monitor_type = Column(Enum(MonitorType), default=MonitorType.HTTP)
    status = Column(Enum(MonitorStatus), default=MonitorStatus.UNKNOWN)
    is_active = Column(Boolean, default=True)
    response_time_ms = Column(Float, nullable=True)
    expected_status_code = Column(Integer, default=200)
    last_checked_at = Column(DateTime, nullable=True)
    alert_on_down = Column(Boolean, default=True)
    alert_whatsapp_numbers = Column(String(500), default="")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())