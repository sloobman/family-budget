from sqlalchemy.orm import Session
from app.models.family_member import FamilyMember
from app.schemas.family_member import FamilyMemberCreate, FamilyMemberUpdate
from fastapi import HTTPException


def create_family_member(db: Session, member: FamilyMemberCreate):
    db_member = FamilyMember(**member.dict())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member


def get_family_members(db: Session):
    return db.query(FamilyMember).all()


def update_family_member(db: Session, member: FamilyMember, updates: FamilyMemberUpdate):
    if updates.name is not None:
        member.name = updates.name
    if updates.relation is not None:
        member.relation = updates.relation

    db.commit()
    db.refresh(member)
    return member


def delete_family_member(db: Session, member: FamilyMember):
    db.delete(member)
    db.commit()
