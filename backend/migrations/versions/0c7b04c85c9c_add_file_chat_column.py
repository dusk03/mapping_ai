"""add file_chat column

Revision ID: 0c7b04c85c9c
Revises: 6e91caaf7b4a
Create Date: 2025-03-10 14:49:36.510345

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = "0c7b04c85c9c"
down_revision: Union[str, None] = "6e91caaf7b4a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "chatbots",
        sa.Column(
            "chat_with_file", sa.Boolean(), nullable=False, server_default=sa.false()
        ),
    )  # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("chatbots", "file_chat")
    # ### end Alembic commands ###
