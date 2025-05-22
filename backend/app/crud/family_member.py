from sqlalchemy.orm import Session
from app.models.family import FamilyMember
from app.schemas.family import FamilyMemberCreate

def create_family_member(db: Session, member: FamilyMemberCreate):
    db_member = FamilyMember(**member.dict())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def get_family_members(db: Session):
    return db.query(FamilyMember).all()
