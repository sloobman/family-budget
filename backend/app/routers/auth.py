from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app import models, schemas
from app.utils import auth
from app.db import get_db
from app.utils.auth import oauth2_scheme

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.user.UserResponse)
def register(user: schemas.user.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.user.User).filter(
        models.user.User.username == user.username
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    # Создаем семью для родителя
    family = None
    if user.is_parent:
        family = models.Family(name=f"{user.first_name}'s Family")
        db.add(family)
        db.commit()
        db.refresh(family)

    hashed_pw = auth.get_password_hash(user.password)
    db_user = models.user.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw,
        first_name=user.first_name,
        last_name=user.last_name,
        is_parent=user.is_parent,
        family_id=family.id if family else None
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Если это родитель, создаем запись члена семьи
    if user.is_parent:
        family_member = models.FamilyMember(
            name=f"{user.first_name} {user.last_name}",
            relation="parent",
            user_id=db_user.id,
            family_id=family.id
        )
        db.add(family_member)
        db.commit()

    return db_user


@router.post("/login", response_model=schemas.user.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}



@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    # Теоретически, здесь можно записать токен в "чёрный список"
    # или удалить его из памяти (если ты хранишь сессионные данные)
    return {"message": "Successfully logged out"}