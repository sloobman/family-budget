from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)  # сумма цели
    description = Column(Text, nullable=True)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)

    family = relationship("Family", back_populates="goals")