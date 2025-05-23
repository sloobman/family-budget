from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)
    name = Column(String, nullable=False)
    relation = Column(String, nullable=False)  # "Отец", "Ребенок" и т.д.

    user = relationship("User", back_populates="family_members")
    family = relationship("Family", back_populates="members")
    accounts = relationship("Account", back_populates="family_member")