from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.account import Account
from app.models.family_member import FamilyMember
from app.schemas.account import AccountCreate, AccountResponse
from app.utils.permissions import check_family_access

router = APIRouter(prefix="/accounts", tags=["Accounts"])


@router.post("/", response_model=AccountResponse)
def create_account(
    account: AccountCreate,
    db: Session = Depends(get_db),
    member: FamilyMember = Depends(check_family_access)
):
    db_account = Account(**account.dict())
    db.add(db_account)
    db.commit()
    db.refresh(db_account)
    return db_account