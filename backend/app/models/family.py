from sqlalchemy import Column, Integer, String
from app.db import Base
from sqlalchemy.orm import relationship

class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    relation = Column(String, nullable=False)
    accounts = relationship("Account", back_populates="family_member", cascade="all, delete-orphan")
    incomes = relationship("Income", back_populates="family_member")
