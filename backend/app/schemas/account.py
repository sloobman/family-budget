from pydantic import BaseModel
from typing import Optional

class AccountBase(BaseModel):
    name: str
    family_member_id: int

class AccountCreate(AccountBase):
    pass

class Account(AccountBase):
    id: int

    class Config:
        orm_mode = True