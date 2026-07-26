import asyncio

from app.database.models import RepositoryFile
from app.github import client, repository
from app.github.filters import should_ignore_file
from app.github.repository_service.file_changes import get_file_changes


async def sync_files(
    db,
    repo,
    access_token: str,
):
    github_files = await get_github_files(
        repo=repo,
        access_token=access_token,
    )

    existing_files = repository.get_files(
        db=db,
        repository_id=repo.id,
    )

    changes = get_file_changes(
        github_files,
        existing_files,
    )

    return await apply_file_changes(
        db=db,
        repo=repo,
        changes=changes,
        access_token=access_token,
    )


async def get_github_files(
    repo,
    access_token: str,
):
    tree = await client.get_tree(
        access_token=access_token,
        full_name=repo.full_name,
        branch=repo.default_branch,
    )

    return [
        item
        for item in tree["tree"]
        if item["type"] == "blob" and not should_ignore_file(item["path"])
    ]


async def apply_file_changes(
    db,
    repo,
    changes,
    access_token: str,
):
    files = []

    changed_files = changes["new"] + changes["updated"]

    await delete_removed_files(
        db=db,
        deleted_files=changes["deleted"],
    )

    if not changed_files:
        db.commit()
        return files

    BATCH_SIZE = 50

    for i in range(
        0,
        len(changed_files),
        BATCH_SIZE,
    ):
        batch = changed_files[i : i + BATCH_SIZE]

        contents = await asyncio.gather(
            *[
                client.get_blob(
                    access_token=access_token,
                    full_name=repo.full_name,
                    sha=file["sha"],
                )
                for file in batch
            ],
            return_exceptions=True,
        )

        for file, content in zip(
            batch,
            contents,
        ):
            if isinstance(content, Exception):
                continue

            existing = next(
                (item for item in changes["updated"] if item["path"] == file["path"]),
                None,
            )

            if existing:
                existing.sha = file["sha"]
                existing.content = content

                files.append(existing)

            else:
                new_file = RepositoryFile(
                    repository_id=repo.id,
                    path=file["path"],
                    sha=file["sha"],
                    content=content,
                )

                db.add(new_file)
                files.append(new_file)

    db.commit()

    return files


async def delete_removed_files(
    db,
    deleted_files,
):
    for file in deleted_files:
        db.delete(file)
