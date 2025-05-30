from sqlalchemy.orm import Session
from app.models.account import Account
from app.schemas.account import AccountCreate


def create_account(db: Session, account: AccountCreate, family_member_id: int) -> Account:
    db_account = Account(
        name=account.name,
        balance=account.balance,
        currency=account.currency,
        family_member_id=family_member_id
    )
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account


def get_accounts_by_family_member(db: Session, family_member_id: int):
    return db.query(Account).filter(Account.family_member_id == family_member_id).all()