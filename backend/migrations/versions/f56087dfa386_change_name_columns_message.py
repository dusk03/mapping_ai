"""change name columns message

Revision ID: f56087dfa386
Revises: a43f71889820
Create Date: 2025-02-24 08:50:40.677307

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = "f56087dfa386"
down_revision: Union[str, None] = "a43f71889820"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("messages", "sender", new_column_name="role")
    op.alter_column("messages", "message", new_column_name="content")


def downgrade() -> None:
    op.alter_column("messages", "role", new_column_name="sender")
    op.alter_column("messages", "content", new_column_name="message")
