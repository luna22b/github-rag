from datetime import datetime

from sqlalchemy import (
    Boolean,
    ForeignKey,
    Integer,
    String,
    Text,
    DateTime,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    hashed_password: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    github_id: Mapped[str | None] = mapped_column(
        String,
        unique=True,
        nullable=True,
    )

    github_username: Mapped[str | None] = mapped_column(
        String,
        nullable=True,
    )

    github_access_token: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    repositories: Mapped[list["Repository"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Repository(Base):
    __tablename__ = "repositories"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    github_repo_id: Mapped[int] = mapped_column(
        Integer,
        unique=True,
        index=True,
        nullable=False,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    private: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
    )

    default_branch: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    html_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        back_populates="repositories",
    )

    files: Mapped[list["RepositoryFile"]] = relationship(
        back_populates="repository",
        cascade="all, delete-orphan",
    )


class RepositoryFile(Base):
    __tablename__ = "repository_files"

    __table_args__ = (
        UniqueConstraint(
            "repository_id",
            "path",
            name="unique_repository_file",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    repository_id: Mapped[int] = mapped_column(
        ForeignKey("repositories.id"),
        nullable=False,
        index=True,
    )

    path: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    sha: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    repository: Mapped["Repository"] = relationship(
        back_populates="files",
    )