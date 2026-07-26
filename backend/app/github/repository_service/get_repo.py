from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.models import User
from app.github import client, repository
from app.core.encryption import decrypt_token


async def get_repo(
    db: Session,
    user: User,
):
    repos = repository.get_by_user_id(
        db=db,
        user_id=user.id,
    )

    if repos:
        return repos

    if not user.github_access_token:
        raise HTTPException(
            status_code=400,
            detail="GitHub account not connected",
        )

    access_token = decrypt_token(user.github_access_token)

    github_repos = await client.get_repositories(access_token)

    return repository.sync_repositories(
        db=db,
        user_id=user.id,
        repos=github_repos,
    )
