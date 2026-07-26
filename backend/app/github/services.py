from sqlalchemy.orm import Session

from app.database.models import User
from app.github.repository_service import (
    get_repo,
    import_repo,
    sync_repo,
)


async def get_repositories(
    db: Session,
    user: User,
):
    return await get_repo(
        db=db,
        user=user,
    )


async def import_repository(
    db: Session,
    user: User,
    repository_id: int,
):
    return await import_repo(
        db=db,
        user=user,
        repository_id=repository_id,
    )


async def sync_repository(
    db: Session,
    user: User,
):
    return await sync_repo(
        db=db,
        user=user,
    )