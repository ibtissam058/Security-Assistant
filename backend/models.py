from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    security_score = Column(Float, default=100.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    scans = relationship("ScanHistory", back_populates="user")

class ScanHistory(Base):
    __tablename__ = "scan_history"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    scan_type = Column(String)
    input_data = Column(String)
    result = Column(String)
    threat_found = Column(String, default="false")
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="scans")