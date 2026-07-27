from alembic import op
from pgvector.sqlalchemy import VECTOR


revision = "891445f29edf"
down_revision = "b506701a2ff7"
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column(
        "code_chunks",
        "embedding",
        existing_type=VECTOR(dim=384),
        type_=VECTOR(dim=768),
        existing_nullable=False,
    )


def downgrade():
    op.alter_column(
        "code_chunks",
        "embedding",
        existing_type=VECTOR(dim=768),
        type_=VECTOR(dim=384),
        existing_nullable=False,
    )