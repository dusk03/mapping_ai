"""null is true for version of chatbot

Revision ID: 6e91caaf7b4a
Revises: a0698e6969c0
Create Date: 2025-03-04 23:23:26.707728

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '6e91caaf7b4a'
down_revision: Union[str, None] = 'a0698e6969c0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('chatbots', 'version',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('chatbots', 'version',
               existing_type=sa.VARCHAR(),
               nullable=False)
    # ### end Alembic commands ###
