from typing import Optional

from pydantic import BaseModel, Field
from datetime import datetime


class TransactionBase(BaseModel):
    amount: float = Field(..., gt=0)
    type: str  # "income" или "expense"
    category_id: Optional[int] = None


class TransactionCreate(TransactionBase):
    account_id: int


class FamilyMemberInfo(BaseModel):
    id: int
    name: str
    relation: str


class CategoryInfo(BaseModel):
    id: int
    name: str

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime
    currency: str
    family_member: FamilyMemberInfo
    category: Optional[CategoryInfo] = None
    class Config:
        from_attributes = True
