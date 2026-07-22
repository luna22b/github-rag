from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

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