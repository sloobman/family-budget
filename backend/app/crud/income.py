from sqlalchemy.orm import Session
from app import models, schemas
from app.models.income import Income
from app.schemas.income import IncomeCreate


def create_income(db: Session, income: IncomeCreate):
    db_income = Income(**income.dict())
    db.add(db_income)
    db.commit()
    db.refresh(db_income)
    return db_income


def get_incomes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Income).offset(skip).limit(limit).all()
