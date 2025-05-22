from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app import crud
from app.schemas import income


router = APIRouter(
    prefix="/incomes",
    tags=["incomes"]
)

@router.post("/", response_model=income.IncomeRead)
def create_income(income: income.IncomeCreate, db: Session = Depends(get_db)):
    return crud.create_income(db=db, income=income)

@router.get("/", response_model=list[income.IncomeRead])
def read_incomes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_incomes(db=db, skip=skip, limit=limit)
