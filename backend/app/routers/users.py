from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserUpdateFamily
from app.utils.auth import get_password_hash, verify_password, get_current_user
from app.utils.permissions import check_admin_access

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        is_parent=user.is_parent
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/me", response_model=UserResponse)
def get_current_user_details(
    current_user: User = Depends(get_current_user)
):
    """
    Получение полной информации о текущем пользователе
    """
    return current_user


@router.get("/{user_id}", response_model=UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(check_admin_access)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user



@router.patch("/{user_id}/family", response_model=UserResponse)
def update_user_family(
    user_id: int,
    family_data: UserUpdateFamily,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Обновляет family_id пользователя.
    Требования:
    - Только администратор может менять family_id другим пользователям
    - Обычный пользователь может обновлять только свой family_id
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Проверка прав
    if not current_user.is_parent and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this user's family"
        )

    # Обновляем family_id
    db_user.family_id = family_data.family_id
    db.commit()
    db.refresh(db_user)
    return db_user