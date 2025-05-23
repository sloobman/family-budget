from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.schemas.family_member import FamilyMemberCreate, FamilyMemberOut
from app.crud.family_member import create_family_member, get_family_members

router = APIRouter(prefix="/members", tags=["Family Members"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=FamilyMemberOut)
def add_member(member: FamilyMemberCreate, db: Session = Depends(get_db)):
    return create_family_member(db, member)


@router.get("/", response_model=list[FamilyMemberOut])
def list_members(db: Session = Depends(get_db)):
    return get_family_members(db)
