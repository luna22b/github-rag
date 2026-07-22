from sqlalchemy.orm import Session

from app.database.models import User
from app.github import client
from app.github import repository
from app.core.encryption import decrypt_token


async def get_repositories(db: Session, user: User):
    repos = repository.get_by_user_id(
        db=db,
        user_id=user.id,
    )

    if repos:
        return repos

    access_token = decrypt_token(user.github_access_token)

    github_repos = await client.get_repositories(access_token)

    saved_repos = repository.create_many(
        db=db,
        user_id=user.id,
        repos=github_repos,
    )

    return saved_repos