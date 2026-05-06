from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base


class Income(Base):
    __tablename__ = "incomes"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("family_members.id"), nullable=False)
    amount = Column(Float, nullable=False)
    income_type = Column(String, nullable=False)
    date = Column(Date, nullable=False)

    member = relationship("FamilyMember", back_populates="incomes")
