from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db import Base
from app.models.family_member import FamilyMember

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(Enum("income", "expense", name="transaction_type"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    family_member_id = Column(Integer, ForeignKey("family_members.id"), nullable=False)
    account = relationship("Account", back_populates="transactions")
    family_member = relationship("FamilyMember")
    category = relationship("Category", back_populates="transactions")