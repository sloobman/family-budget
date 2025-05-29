from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from app.db import get_db
from app.models import FamilyMember
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.account import Account
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.utils.auth import get_current_user
from app.utils.permissions import check_account_access
from typing import List
from app.models.user import User

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/", response_model=TransactionResponse)
def create_transaction(
        transaction: TransactionCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    account = db.query(Account).filter(Account.id == transaction.account_id).first()
    if not account or account.family_member.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="No access to this account")
        # Проверка категории, если она указана
    if transaction.category_id:
        category = db.query(Category).filter(
            Category.id == transaction.category_id,
            Category.family_id == current_user.family_id
        ).first()
        if not category:
            raise HTTPException(
                status_code=400,
                detail="Category not found or not accessible"
            )
    # Проверка баланса для расходов
    if transaction.type == "expense" and account.balance < transaction.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    # Обновление баланса счета
    if transaction.type == "income":
        account.balance += transaction.amount
    else:
        account.balance -= transaction.amount

    family_member = db.query(FamilyMember).filter(FamilyMember.user_id == current_user.id).first()
    if not family_member:
        raise HTTPException(status_code=404, detail="Family member not found")


    db_transaction = Transaction(
        **transaction.dict(),
        family_member_id=family_member.id
    )
    db.add(db_transaction)
    db.commit()

    category_info = None
    if db_transaction.category:
        category_info = {
            'id': db_transaction.category.id,
            'name': db_transaction.category.name
        }

    transaction_data = db_transaction.__dict__
    transaction_data.update({
        'currency': account.currency,
        'family_member': {
            'id': family_member.id,
            'name': family_member.name,
            'relation': family_member.relation,
        },
        'category': category_info
    })


    return db_transaction


@router.get("/", response_model=List[TransactionResponse])
def get_transactions(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # Получаем текущего участника семьи
    current_member = db.query(FamilyMember).filter(
        FamilyMember.user_id == current_user.id
    ).first()

    if not current_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a family member"
        )

    # Создаём базовый запрос с join к Account
    query = db.query(
        Transaction,
        Account.currency,
        FamilyMember
    ).join(
        Account,
        Transaction.account_id == Account.id
    ).join(
        FamilyMember,
        Account.family_member_id == FamilyMember.id
    )

    if current_user.is_parent:
        # Для родителя - все транзакции семьи
        query = query.filter(Account.family_id == current_user.family_id)
    else:
        # Для ребёнка - только его транзакции
        query = query.filter(
            Account.family_member_id == current_member.id,
            Account.family_id == current_user.family_id
        )

    # Получаем результаты и преобразуем их
    results = query.order_by(Transaction.created_at.desc()).all()

    transactions = []
    for transaction, currency, member in results:
        transaction_dict = transaction.__dict__
        transaction_dict.update({
            'currency': currency,
            'family_member': {
                'id': member.id,
                'name': member.name,
                'relation': member.relation,
            }
        })
        transactions.append(transaction_dict)

    return transactions
