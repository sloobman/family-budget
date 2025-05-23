from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class Saving(Base):
    __tablename__ = "savings"

    id = Column(Integer, primary_key=True, index=True)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)
    name = Column(String, nullable=False)  # "На отпуск", "На ремонт" и т.д.
    target_amount = Column(Float)
    current_amount = Column(Float, default=0.0)

    family = relationship("Family", back_populates="savings")