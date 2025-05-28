from pydantic import BaseModel, Field, validator
from typing import Optional, Dict
from enum import Enum


class Currency(str, Enum):
    RUB = "RUB"
    USD = "USD"
    EUR = "EUR"


class AccountBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    currency: Currency = Currency.RUB
    balance: float = Field(ge=0)
    family_id: int


class AccountCreate(AccountBase):
    family_member_id: int


class AccountResponse(AccountBase):
    id: int

    class Config:
        orm_mode = True


class FamilyBalancesResponse(BaseModel):
    balances: Dict[str, float]  # Ключ - валюта, значение - сумма

    class Config:
        orm_mode = True