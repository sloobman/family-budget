from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from app.db import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryResponse
from app.utils.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("/", response_model=CategoryResponse)
def create_category(
        category: CategoryCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # Проверяем, что пользователь является родителем в семье
    if not current_user.is_parent:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only parents can create categories"
        )
    family_id = current_user.family_id
    # Проверяем, что семья принадлежит пользователю


    # Проверяем, что категория с таким именем не существует
    existing_category = db.query(Category).filter(
        Category.name == category.name,
        Category.family_id == family_id
    ).first()

    if existing_category:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this name already exists"
        )

    db_category = Category(
        name=category.name,
        family_id=family_id
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    return db_category


@router.get("/", response_model=list[CategoryResponse])
def get_categories(
        family_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # Проверяем, что пользователь принадлежит к семье
    if current_user.family_id != family_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No access to this family's categories"
        )

    categories = db.query(Category).filter(
        Category.family_id == family_id
    ).all()

    return categories


@router.delete("/{category_id}")
def delete_category(
        category_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    # Проверяем, что пользователь является родителем в семье
    if not current_user.is_parent:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only parents can delete categories"
        )

    # Проверяем, что категория принадлежит семье пользователя
    if current_user.family_id != category.family_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No access to this category"
        )

    # Проверяем, что категория не используется в транзакциях
    if category.transactions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete category that is used in transactions"
        )

    db.delete(category)
    db.commit()

    return {"message": "Category deleted successfully"}