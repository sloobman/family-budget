from pydantic import BaseModel, EmailStr, field_validator, Field
from datetime import datetime


class UserUpdateFamily(BaseModel):
    family_id: int | None

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=2, max_length=50)
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    is_parent: bool = Field(default=False)


    @field_validator('password')
    def validate_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserCreateForFamilyMember(UserBase):
    password: str = Field(..., min_length=8)
    relation: str = "child"  # кто он: 'child', 'sibling' и т.п.

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
    family_id: int
    class Config:
        from_attributes = True  # Вместо orm_mode = True

