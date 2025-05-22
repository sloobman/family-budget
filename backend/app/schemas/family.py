from pydantic import BaseModel

class FamilyMemberBase(BaseModel):
    name: str
    relation: str

class FamilyMemberCreate(FamilyMemberBase):
    pass

class FamilyMemberOut(FamilyMemberBase):
    id: int

    class Config:
        orm_mode = True
