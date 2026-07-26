""".

Revision ID: 9db7408015be
Revises: c2b55d18961c
Create Date: 2026-07-26 14:38:04.105299

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9db7408015be'
down_revision: Union[str, Sequence[str], None] = 'c2b55d18961c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
