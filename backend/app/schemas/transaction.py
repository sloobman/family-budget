from pydantic import BaseModel, Field
from datetime import datetime


class TransactionBase(BaseModel):
    amount: float = Field(..., gt=0)
    type: str  # "income" или "expense"
    category: str | None = None


class TransactionCreate(TransactionBase):
    account_id: int


class FamilyMemberInfo(BaseModel):
    id: int
    name: str
    relation: str

class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime
    currency: str
    family_member: FamilyMemberInfo
    class Config:
        from_attributes = True
