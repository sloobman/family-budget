from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.account import Account
from app.models.family_member import FamilyMember
from app.models.user import User
from fastapi.security import OAuth2PasswordBearer
from app.utils.auth import get_current_user


def check_family_access(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
) -> FamilyMember:
    """Проверяет, что пользователь - член семьи"""
    member = db.query(FamilyMember).filter(
        FamilyMember.user_id == current_user.id
    ).first()

    if not member:
        raise HTTPException(status_code=403, detail="User is not a family member")
    return member

def check_account_access(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account or account.family_member.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No access to this account")
    return account


def check_admin_access(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_parent:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
