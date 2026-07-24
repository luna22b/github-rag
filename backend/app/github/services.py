import asyncio

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database.models import RepositoryFile, User
from app.github import client
from app.github import repository
from app.core.encryption import decrypt_token

from app.github.filters import should_ignore_file


async def get_repositories(db: Session, user: User):
    repos = repository.get_by_user_id(
        db=db,
        user_id=user.id,
    )

    if repos:
        return repos

    access_token = decrypt_token(user.github_access_token)

    github_repos = await client.get_repositories(access_token)

    saved_repos = repository.sync_repositories(
        db=db,
        user_id=user.id,
        repos=github_repos,
    )

    return saved_repos


async def sync_repositories(
    db: Session,
    user: User,
):
    access_token = decrypt_token(user.github_access_token)

    github_repos = await client.get_repositories(access_token)

    saved_repos = repository.sync_repositories(
        db=db,
        user_id=user.id,
        repos=github_repos,
    )

    return saved_repos

async def import_repository(
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

    access_token = decrypt_token(
        user.github_access_token
    )

    tree = await client.get_tree(
        access_token=access_token,
        full_name=repo.full_name,
        branch=repo.default_branch,
    )

    blobs = [
        item
        for item in tree["tree"]
        if item["type"] == "blob"
        and not should_ignore_file(item["path"])
    ]

    BATCH_SIZE = 50

    for i in range(0, len(blobs), BATCH_SIZE):
        batch = blobs[i:i + BATCH_SIZE]

    contents = await asyncio.gather(
        *[
            client.get_blob(
                access_token=access_token,
                full_name=repo.full_name,
                sha=blob["sha"],
            )
            for blob in blobs
        ],
        return_exceptions=True,
    )

    files = []

    BATCH_SIZE = 50

    for i in range(0, len(blobs), BATCH_SIZE):
        batch = blobs[i:i + BATCH_SIZE]

        contents = await asyncio.gather(
            *[
                client.get_blob(
                    access_token=access_token,
                    full_name=repo.full_name,
                    sha=blob["sha"],
                )
                for blob in batch
            ],
            return_exceptions=True,
        )

        for blob, content in zip(batch, contents):
            if isinstance(content, Exception):
                continue

            files.append(
                RepositoryFile(
                    repository_id=repo.id,
                    path=blob["path"],
                    sha=blob["sha"],
                    content=content,
                )
            )

    db.add_all(files)
    db.commit()

    return repo, files