from sqlmodel.ext.asyncio.session import AsyncSession
from datetime import datetime
from sqlmodel import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.sql.expression import and_
from src.db.models import Conversation, PermissionUserChatbot
from src.conversations.schemas import ConversationCreate, ConversationUpdate
import uuid


class ConversationService:
    async def get_all_conversations(self, user_id: uuid.UUID, session: AsyncSession):
        """
        Lấy danh sách tất cả các conversation của một user, sắp xếp theo ngày tạo giảm dần.
        """
        statement = (
            select(Conversation)
            .where(Conversation.user_uid == user_id)
            .order_by(desc(Conversation.created_at))
            .options(
                selectinload(Conversation.chatbot), selectinload(Conversation.messages)
            )
        )
        result = await session.exec(statement)
        return result.all()

    async def create_conversation(
        self, user_uid, conversation_data: ConversationCreate, session: AsyncSession
    ):
        """
        Tạo một conversation mới.
        """
        conversation_data_dict = conversation_data.model_dump()
        conversation_data_dict["user_uid"] = user_uid
        new_conversation = Conversation(**conversation_data_dict)
        new_conversation.created_at = datetime.now()
        session.add(new_conversation)
        await session.commit()
        await session.refresh(new_conversation)
        return new_conversation

    async def update_conversation_title(
        self,
        conversation: Conversation,
        conversation_data: ConversationUpdate,
        session: AsyncSession,
    ):

        if conversation_data.title:
            conversation.title = conversation_data.title

        session.add(conversation)
        await session.commit()
        await session.refresh(conversation)

        return conversation

    async def delete_conversation(
        self,
        conversation: Conversation,
        session: AsyncSession,
    ) -> None:

        await session.delete(conversation)
        await session.commit()

    async def check_ban(self, user_uid: str, chatbot_uid: str, session: AsyncSession):

        statement_permission = select(PermissionUserChatbot).where(
            and_(
                PermissionUserChatbot.chatbot_uid == chatbot_uid,
                PermissionUserChatbot.user_uid == user_uid,
            )
        )
        result = await session.exec(statement_permission)
        permission = result.first()
        return permission
