from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import Family, User
from app.schemas.family import FamilyOut, FamilyCreate
from app.schemas.family_member import FamilyMemberCreate, FamilyMemberOut
from app.crud.family_member import create_family_member, get_family_members
from app.utils.auth import get_current_user

router = APIRouter(prefix="/families", tags=["families"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=FamilyOut)
def create_family(family: FamilyCreate, db: Session = Depends(get_db)):
    db_family = Family(name=family.name)
    db.add(db_family)
    db.commit()
    db.refresh(db_family)
    return db_family

@router.get("/")
def get_families(db: Session = Depends(get_db)):
    families = db.query(Family).all()
    return families


@router.get("/my-family", response_model=FamilyOut)
def get_current_user_family(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    if not current_user.family_id:
        raise HTTPException(
            status_code=404,
            detail="User is not a member of any family"
        )

    family = db.query(Family).filter(Family.id == current_user.family_id).first()
    if not family:
        raise HTTPException(
            status_code=404,
            detail="Family not found"
        )
    print(family.id)
    return family





@router.post("/", response_model=FamilyMemberOut)
def add_member(member: FamilyMemberCreate, db: Session = Depends(get_db)):
    return create_family_member(db, member)


@router.get("/", response_model=list[FamilyMemberOut])
def list_members(db: Session = Depends(get_db)):
    return get_family_members(db)
