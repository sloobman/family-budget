from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class Family(Base):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Название семьи (например, "Семья Ивановых")

    users = relationship("User", back_populates="family")
    members = relationship("FamilyMember", back_populates="family")
    savings = relationship("Saving", back_populates="family")
    categories = relationship("Category", back_populates="family")
    goals = relationship("Goal", back_populates="family", cascade="all, delete")


