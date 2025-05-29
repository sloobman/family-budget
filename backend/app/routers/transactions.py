from collections import defaultdict
from sqlalchemy import func
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from fastapi.responses import StreamingResponse
from io import BytesIO
from openpyxl import Workbook
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
    if transaction.type == "expense" and account.balance < 0:
        raise HTTPException(status_code=400, detail="Отрицательный баланс счёта, операции расхода запрещены! Добавьте денег.")

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


    query = query.filter(Account.family_id == current_user.family_id)


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





@router.get("/income/total", summary="Получить общую сумму доходов")
def get_total_income(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_member = db.query(FamilyMember).filter(
        FamilyMember.user_id == current_user.id
    ).first()

    if not current_member:
        raise HTTPException(status_code=403, detail="User is not a family member")

    query = db.query(func.sum(Transaction.amount)).join(Account).filter(
        Transaction.type == "income",
        Account.family_id == current_user.family_id
    )


    total = query.scalar() or 0
    return {"total_income": total}


@router.get("/expense/total", summary="Получить общую сумму расходов")
def get_total_expense(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_member = db.query(FamilyMember).filter(
        FamilyMember.user_id == current_user.id
    ).first()

    if not current_member:
        raise HTTPException(status_code=403, detail="User is not a family member")

    query = db.query(func.sum(Transaction.amount)).join(Account).filter(
        Transaction.type == "expense",
        Account.family_id == current_user.family_id
    )



    total = query.scalar() or 0
    return {"total_expense": total}




@router.get("/export")
def export_transactions_excel(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # Получаем текущего участника семьи
    current_member = db.query(FamilyMember).filter(
        FamilyMember.user_id == current_user.id
    ).first()

    if not current_member:
        raise HTTPException(
            status_code=403,
            detail="User is not a family member"
        )

    # Базовый запрос с join для получения транзакций + валюты + участника
    query = db.query(
        Transaction,
        Account.currency,
        FamilyMember
    ).join(
        Account, Transaction.account_id == Account.id
    ).join(
        FamilyMember, Transaction.family_member_id == FamilyMember.id
    )

    # Фильтры для доступа
    if current_user.is_parent:
        query = query.filter(Account.family_id == current_user.family_id)
    else:
        query = query.filter(
            Transaction.family_member_id == current_member.id,
            Account.family_id == current_user.family_id
        )

    transactions = query.order_by(Transaction.created_at.desc()).all()

    data = {
        "income": defaultdict(list),
        "expense": defaultdict(list)
    }

    for transaction, currency, member in transactions:
        category_name = transaction.category.name if transaction.category else "Без категории"
        data[transaction.type][category_name].append((transaction, member))

    wb = Workbook()
    ws = wb.active
    ws.title = "Транзакции"

    # Заголовок таблицы
    ws.append(["СТАТЬЯ", "КТО", "СУММА", "ДАТА"])

    def write_group(group_name: str, group_data: dict):
        ws.append([group_name.upper()])  # Заголовок группы доходы/расходы (с большой буквы)

        group_total = 0

        for category, items in group_data.items():
            category_total = 0
            for transaction, member in items:
                ws.append([
                    category,
                    f"{member.name} ({member.relation})",
                    transaction.amount,
                    transaction.created_at.strftime("%Y-%m-%d")
                ])
                category_total += transaction.amount
            group_total += category_total
        return group_total

    total_income = write_group("доход", data["income"])
    total_expense = write_group("расход", data["expense"])

    # Общий итог
    ws.append(["ИТОГ", "", "", ""])
    ws.append(["ДОХОД", "", total_income, ""])
    ws.append(["РАСХОД", "", total_expense, ""])
    ws.append(["Баланс", "", total_income - total_expense, ""])

    stream = BytesIO()
    wb.save(stream)
    stream.seek(0)

    filename = "transactions.xlsx"
    headers = {
        "Content-Disposition": f"attachment; filename={filename}"
    }

    return StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers
    )



