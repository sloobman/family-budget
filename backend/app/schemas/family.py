from pydantic import BaseModel
from datetime import datetime

class FamilyBase(BaseModel):
    name: str

class FamilyCreate(FamilyBase):
    pass

class FamilyOut(FamilyBase):
    id: int

    class Config:
        from_attributes = True  # Ранее называлось orm_mode=True