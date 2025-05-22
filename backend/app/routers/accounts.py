from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas import account as schema
from app.crud import account as crud
from app.db import get_db

router = APIRouter(prefix="/accounts", tags=["Accounts"])

@router.post("/", response_model=schema.Account)
def create_account(account: schema.AccountCreate, db: Session = Depends(get_db)):
    return crud.create_account(db, account)

@router.get("/family_member/{family_member_id}", response_model=list[schema.Account])
def read_accounts(family_member_id: int, db: Session = Depends(get_db)):
    return crud.get_accounts_by_family_member(db, family_member_id)