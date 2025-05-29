from sqlalchemy.orm import Session
from app.models.goal import Goal
from app.schemas.goal import GoalCreate
from sqlalchemy import func

def create_goal(db: Session, goal_data: dict) -> Goal:
    db_goal = Goal(**goal_data)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

def get_goals(db: Session, family_id: int):
    return db.query(Goal).filter(Goal.family_id == family_id).all()

def delete_goal(db: Session, goal_id: int):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if goal:
        db.delete(goal)
        db.commit()
    return goal


def get_goals_total_amount(db: Session, family_id: int) -> float:
    total = db.query(func.sum(Goal.amount)).filter(Goal.family_id == family_id).scalar()
    return total or 0.0
