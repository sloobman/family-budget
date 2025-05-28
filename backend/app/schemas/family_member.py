from pydantic import BaseModel
from typing import Optional

class FamilyMemberBase(BaseModel):
    name: str
    relation: str

class FamilyMemberCreate(FamilyMemberBase):
    user_id: int  # Добавляем обязательное поле
    family_id: Optional[int] = None  # Может быть None, будет установлено автоматически

class FamilyMemberUpdate(FamilyMemberBase):
    name: Optional[str] = None
    relation: Optional[str] = None

class FamilyMemberOut(FamilyMemberBase):
    id: int
    user_id: int
    family_id: int

    class Config:
        from_attributes = True  # Используйте это вместо orm_mode для Pydantic v2