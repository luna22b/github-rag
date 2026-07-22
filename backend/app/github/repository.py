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


def create_many(
    db: Session,
    user_id: int,
    repos: list[dict],
):
    saved_repos = []

    for repo in repos:
        repository = Repository(
            github_repo_id=repo["id"],
            user_id=user_id,
            name=repo["name"],
            full_name=repo["full_name"],
            description=repo.get("description"),
            private=repo["private"],
            default_branch=repo["default_branch"],
            html_url=repo["html_url"],
        )

        db.add(repository)
        saved_repos.append(repository)

    db.commit()

    for repo in saved_repos:
        db.refresh(repo)

    return saved_repos