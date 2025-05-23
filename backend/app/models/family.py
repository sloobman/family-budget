from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db import Base

class Family(Base):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # Название семьи (например, "Семья Ивановых")

    members = relationship("FamilyMember", back_populates="family")
    savings = relationship("Saving", back_populates="family")