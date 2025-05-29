from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.utils.auth import get_current_user
from app.models.user import User
import app.crud.goal as goal_crud
import app.schemas.goal as goal_schema
from typing import List
from fastapi import HTTPException

router = APIRouter(prefix="/goals", tags=["Goals"])

@router.post("/", response_model=goal_schema.GoalRead)
def create_goal(goal: goal_schema.GoalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal_data = goal.dict()
    goal_data["family_id"] = current_user.family_id
    return goal_crud.create_goal(db, goal_data)

@router.get("/", response_model=List[goal_schema.GoalRead])
def list_goals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return goal_crud.get_goals(db, current_user.family_id)

@router.get("/total_amount")
def get_total_amount(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total = goal_crud.get_goals_total_amount(db, current_user.family_id)
    return {"total_amount": total}

@router.delete("/{goal_id}", response_model=goal_schema.GoalRead)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    return goal_crud.delete_goal(db, goal_id)
