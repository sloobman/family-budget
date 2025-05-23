from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.family_member import FamilyMember
from app.models.user import User
from app.schemas.family_member import FamilyMemberCreate, FamilyMemberOut
from app.utils.auth import get_current_user
from app.utils.permissions import check_family_access

router = APIRouter(prefix="/family-members", tags=["Family Members"])


@router.post("/", response_model=FamilyMemberOut)
def create_family_member(
        member: FamilyMemberCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    if not current_user.is_parent:
        raise HTTPException(status_code=403, detail="Only parents can add members")

    db_member = FamilyMember(**member.dict(), family_id=current_user.family_id)
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member


@router.get("/{member_id}", response_model=FamilyMemberOut)
def read_family_member(member: FamilyMember = Depends(check_family_access)):
    return member
