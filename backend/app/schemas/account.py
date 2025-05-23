from pydantic import BaseModel, Field, validator
from typing import Optional
from enum import Enum


class Currency(str, Enum):
    RUB = "RUB"
    USD = "USD"
    EUR = "EUR"


class AccountBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    currency: Currency = Currency.RUB
    balance: float = Field(ge=0)


class AccountCreate(AccountBase):
    family_member_id: int

    @validator('balance')
    def round_balance(cls, v):
        return round(v, 2)


class AccountResponse(AccountBase):
    id: int

    class Config:
        orm_mode = True
