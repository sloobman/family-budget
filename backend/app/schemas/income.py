from pydantic import BaseModel
from datetime import date

class IncomeBase(BaseModel):
    amount: float
    income_type: str
    date: date
    member_id: int

class IncomeCreate(IncomeBase):
    pass

class IncomeRead(IncomeBase):
    id: int

    class Config:
        orm_mode = True
