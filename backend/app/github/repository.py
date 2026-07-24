from sqlalchemy.orm import Session

from app.database.models import Repository


def get_by_user_id(
    db: Session,
    user_id: int,
):
    return (
        db.query(Repository)
        .filter(
            Repository.user_id == user_id,
            Repository.is_active == True,
        )
        .all()
    )

def get_by_id(
    db: Session,
    user_id: int,
    repo_id: int,
):
    return (
        db.query(Repository)
        .filter(
            Repository.id == repo_id,
            Repository.user_id == user_id,
            Repository.is_active == True,
        )
        .first()
    )


def sync_repositories(
    db: Session,
    user_id: int,
    repos: list[dict],
):
    existing_repos = {
        repo.github_repo_id: repo
        for repo in db.query(Repository)
        .filter(Repository.user_id == user_id)
        .all()
    }

    github_repo_ids = set()

    for github_repo in repos:
        github_repo_ids.add(github_repo["id"])

        if github_repo["id"] in existing_repos:
            repo = existing_repos[github_repo["id"]]

            repo.name = github_repo["name"]
            repo.description = github_repo.get("description")
            repo.private = github_repo["private"]
            repo.default_branch = github_repo["default_branch"]
            repo.html_url = github_repo["html_url"]
            repo.is_active = True

        else:
            repo = Repository(
                github_repo_id=github_repo["id"],
                user_id=user_id,
                name=github_repo["name"],
                full_name=github_repo["full_name"],
                description=github_repo.get("description"),
                private=github_repo["private"],
                default_branch=github_repo["default_branch"],
                html_url=github_repo["html_url"],
                is_active=True,
            )

            db.add(repo)

    for repo in existing_repos.values():
        if repo.github_repo_id not in github_repo_ids:
            repo.is_active = False

    db.commit()

    return (
        db.query(Repository)
        .filter(
            Repository.user_id == user_id,
            Repository.is_active == True,
        )
        .all()
    )