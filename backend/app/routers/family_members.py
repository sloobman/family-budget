from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from starlette import status

from app import models
from app.db import get_db
from app.models.family_member import FamilyMember
from app.models.user import User
from app.utils.auth import get_current_user
from app.utils.permissions import check_family_access
from app.schemas.family_member import FamilyMemberCreate, FamilyMemberOut, FamilyMemberUpdate
from app.crud.family_member import update_family_member, delete_family_member

router = APIRouter(prefix="/family-members", tags=["Family Members"])


@router.post("/", response_model=FamilyMemberOut)
def create_family_member(
        member: FamilyMemberCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    if not current_user.is_parent:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only parents can add members"
        )

    # Если family_id не указан, используем семью текущего пользователя
    family_id = member.family_id if member.family_id else current_user.family_id

    if not family_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Family not found"
        )

    # Проверяем существование семьи
    family = db.query(models.Family).filter(models.Family.id == family_id).first()
    if not family:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Family not found"
        )

    db_member = models.FamilyMember(
        name=member.name,
        relation=member.relation,
        user_id=member.user_id,  # Используем user_id из схемы
        family_id=family_id
    )

    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member


@router.get("/", response_model=list[FamilyMemberOut])
def get_family_members(
        family_id: Optional[int] = Query(None),  # Делаем параметр необязательным
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Получаем членов семьи:
    - Если указан family_id - возвращаем членов этой семьи
    - Если не указан - возвращаем членов семьи текущего пользователя
    """

    query = db.query(FamilyMember)
    print(query)
    if family_id is not None:
        query = query.filter(FamilyMember.family_id == family_id)
        print("1", FamilyMember.family_id == family_id)
    else:
        if not current_user.family_id:
            print("2", current_user.family_id)
            return []
        query = query.filter(FamilyMember.family_id == current_user.family_id)
    print("3", query, query.all())
    return query.all()

@router.get("/{member_id}", response_model=FamilyMemberOut)
def read_family_member(member: FamilyMember = Depends(check_family_access)):
    return member


@router.put("/{member_id}", response_model=FamilyMemberOut)
def update_member(
    updates: FamilyMemberUpdate,
    member: FamilyMember = Depends(check_family_access),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_parent:
        raise HTTPException(status_code=403, detail="Only parents can update members")
    return update_family_member(db, member, updates)


@router.delete("/{member_id}", status_code=204)
def delete_member(
    member: FamilyMember = Depends(check_family_access),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_parent:
        raise HTTPException(status_code=403, detail="Only parents can delete members")
    delete_family_member(db, member)