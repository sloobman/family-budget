from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    family_id = Column(Integer, ForeignKey("families.id"), index=True)
    family_member_id = Column(Integer, ForeignKey("family_members.id"), nullable=False)
    name = Column(String, nullable=False)  # "Основной счет", "Копилка" и т.д.
    balance = Column(Float, default=0.0)
    currency = Column(String, default="RUB")

    family_member = relationship("FamilyMember", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")