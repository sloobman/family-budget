from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.transaction import Transaction
from app.models.account import Account
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.utils.permissions import check_account_access

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/", response_model=TransactionResponse)
def create_transaction(
        transaction: TransactionCreate,
        db: Session = Depends(get_db),
        account: Account = Depends(check_account_access)
):
    # Проверка баланса для расходов
    if transaction.type == "expense" and account.balance < transaction.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    # Обновление баланса счета
    if transaction.type == "income":
        account.balance += transaction.amount
    else:
        account.balance -= transaction.amount

    db_transaction = Transaction(**transaction.dict(), account_id=account.id)
    db.add(db_transaction)
    db.commit()
    return db_transaction
