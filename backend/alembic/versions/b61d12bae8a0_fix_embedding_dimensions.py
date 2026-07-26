"""fix embedding dimensions

Revision ID: b61d12bae8a0
Revises: 6230834cd7a2
Create Date: 2026-07-26 00:14:14.516494

"""

from typing import Sequence, Union

from alembic import op

import pgvector.sqlalchemy

# revision identifiers, used by Alembic.
revision: str = "b61d12bae8a0"
down_revision: Union[str, Sequence[str], None] = "6230834cd7a2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "code_chunks",
        "embedding",
        type_=pgvector.sqlalchemy.vector.VECTOR(dim=768),
        existing_type=pgvector.sqlalchemy.vector.VECTOR(dim=384),
        existing_nullable=False,
    )


def downgrade() -> None:
    op.alter_column(
        "code_chunks",
        "embedding",
        type_=pgvector.sqlalchemy.vector.VECTOR(dim=384),
        existing_type=pgvector.sqlalchemy.vector.VECTOR(dim=768),
        existing_nullable=False,
    )