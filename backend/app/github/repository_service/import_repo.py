from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.models import User
from app.github import repository
from app.core.encryption import decrypt_token
from app.github.repository_service import sync_files
from app.rag import service


async def import_repo(
    db: Session,
    user: User,
    repository_id: int,
):
    repo = repository.get_by_id(
        db=db,
        user_id=user.id,
        repo_id=repository_id,
    )

    if repo is None:
        raise HTTPException(
            status_code=404,
            detail="Repository not found",
        )

    access_token = decrypt_token(user.github_access_token)

    files = await sync_files.sync_files(
        db=db,
        repo=repo,
        access_token=access_token,
    )

    if files:
        for file in files:
            await service.index_file(
                db=db,
                repository=repo,
                file=file,
            )

    return {
        "message": "Repository imported successfully",
        "files_indexed": len(files),
    }
