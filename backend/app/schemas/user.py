from pydantic import BaseModel, EmailStr, field_validator, Field
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=2, max_length=50)
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

    @field_validator('password')
    def validate_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_parent: bool
    created_at: datetime

    class Config:
        orm_mode = True
