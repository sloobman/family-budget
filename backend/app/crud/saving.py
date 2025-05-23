from fastapi import APIRouter, Depends
from app.db import get_db
from sqlalchemy.orm import Session
from app.models.saving import Saving
from app.schemas.saving import SavingCreate, SavingResponse
from app.utils.permissions import check_admin_access

router = APIRouter(prefix="/savings", tags=["Savings"])


@router.post("/", response_model=SavingResponse)
def create_saving(
    saving: SavingCreate,
    db: Session = Depends(get_db),
    family_id: int = Depends(check_admin_access)
):
    db_saving = Saving(**saving.dict(), family_id=family_id)
    db.add(db_saving)
    db.commit()
    return db_saving
