from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # "основной", "накопления", "заначка"
    family_member_id = Column(Integer, ForeignKey("family_members.id"), nullable=False)

    family_member = relationship("FamilyMember", back_populates="accounts")