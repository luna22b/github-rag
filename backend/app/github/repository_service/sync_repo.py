from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.models import User
from app.core.encryption import decrypt_token
from app.github import client, repository


async def sync_repo(
    db: Session,
    user: User,
):
    if not user.github_access_token:
        raise HTTPException(
            status_code=400,
            detail="GitHub account not connected",
        )

    access_token = decrypt_token(user.github_access_token)

    github_repos = await client.get_repositories(access_token)

    saved_repos = repository.sync_repositories(
        db=db,
        user_id=user.id,
        repos=github_repos,
    )

    return saved_repos
