from sqlalchemy import Column, Integer, String, Boolean, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_parent = Column(Boolean, default=False)
    family_id = Column(Integer, ForeignKey('families.id'), nullable=True)  # Добавьте это
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    family = relationship("Family", back_populates="users")
    family_members = relationship("FamilyMember", back_populates="user")
