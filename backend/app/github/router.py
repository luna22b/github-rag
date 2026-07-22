from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import authenticate_user
from app.database.database import get_db
from app.database.models import User
from app.github.schemas import RepositoryResponse
from app.github import services

router = APIRouter()

@router.get("/repos", response_model=list[RepositoryResponse])
async def get_repositories(
    user: User = Depends(authenticate_user),
    db: Session = Depends(get_db),
):
    return await services.get_repositories(
        db=db,
        user=user,
    )