from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette import status

from app.db import get_db
from app.models.account import Account
from app.models.family_member import FamilyMember
from app.schemas.account import AccountCreate, AccountResponse, FamilyBalancesResponse
from app.utils.permissions import check_family_access

router = APIRouter(prefix="/accounts", tags=["Accounts"])


@router.post("/", response_model=AccountResponse)
def create_account(
    account: AccountCreate,
    db: Session = Depends(get_db),
    member: FamilyMember = Depends(check_family_access)
):
    if account.family_member_id != member.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create accounts for yourself"
        )
    db_account = Account(
        name=account.name,
        balance=account.balance,
        currency=account.currency,
        family_id=member.family_id,
        family_member_id=member.id  # Берем из аутентификации
    )

    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


@router.get("/", response_model=List[AccountResponse])
def get_accounts(
    db: Session = Depends(get_db),
    member: FamilyMember = Depends(check_family_access)  # Получаем текущего участника семьи с проверкой доступа
):
    accounts = db.query(Account).filter(Account.family_member_id == member.id).all()
    return accounts


# Добавим в accounts.py
@router.get("/family-balances", response_model=FamilyBalancesResponse)
def get_family_balances(
        db: Session = Depends(get_db),
        member: FamilyMember = Depends(check_family_access)
):
    # Получаем суммы по валютам для всей семьи
    balances_query = db.query(
        Account.currency,
        func.sum(Account.balance).label("total")
    ).filter(
        Account.family_id == member.family_id
    ).group_by(
        Account.currency
    ).all()

    # Преобразуем результат в словарь
    balances = {currency: total for currency, total in balances_query}

    return {"balances": balances}



