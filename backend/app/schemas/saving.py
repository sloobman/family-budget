# backend/app/schemas/saving.py
from pydantic import BaseModel, Field
from datetime import date

class SavingBase(BaseModel):
    name: str = Field(..., min_length=3)
    target_amount: float = Field(..., gt=0)

class SavingCreate(SavingBase):
    family_id: int

class SavingResponse(SavingBase):
    id: int
    current_amount: float

    class Config:
        from_attributes = True