from sqlalchemy.sql import exists
from sqlmodel.ext.asyncio.session import AsyncSession
from datetime import datetime
from sqlmodel import select, desc
from src.db.models import Chatbot, PermissionUserChatbot
from src.chatbot.schemas import ChatbotCreate, ChatbotUpdate
from fastapi import HTTPException, status


class ChatbotService:
    async def get_all_chatbots(self, user_uid: str, session: AsyncSession):
        """Lấy danh sách chatbots không bị cấm"""
        statement = (
            select(Chatbot)
            .join(
                PermissionUserChatbot, PermissionUserChatbot.chatbot_uid == Chatbot.uid
            )
            .where(PermissionUserChatbot.user_uid == user_uid)
            .order_by(desc(Chatbot.created_at))
        )

        result = await session.exec(statement)
        return result.all()

    async def get_all_chatbots_admin(self, session: AsyncSession):
        """Lấy danh sách chatbots không bị cấm"""
        statement = select(Chatbot).order_by(desc(Chatbot.created_at))
        result = await session.exec(statement)
        return result.all()

    async def get_chatbot(self, chatbot_uid: str, session: AsyncSession):
        """Lấy một chatbot cụ thể theo UID"""
        statement = select(Chatbot).where(Chatbot.uid == chatbot_uid)
        result = await session.exec(statement)
        chatbot = result.first()
        return chatbot if chatbot is not None else None

    async def create_chatbot(self, chatbot_data: ChatbotCreate, session: AsyncSession):
        """Tạo một chatbot mới"""
        chatbot_data_dict = chatbot_data.model_dump()
        new_chatbot = Chatbot(**chatbot_data_dict)
        new_chatbot.created_at = datetime.now()
        session.add(new_chatbot)
        await session.commit()
        await session.refresh(new_chatbot)
        return new_chatbot

    async def update_chatbot(
        self, chatbot_uid: str, update_data: ChatbotUpdate, session: AsyncSession
    ):
        """Cập nhật một chatbot"""
        chatbot_to_update = await self.get_chatbot(chatbot_uid, session)
        if chatbot_to_update is not None:
            update_data_dict = update_data.model_dump(exclude_unset=True)
            for k, v in update_data_dict.items():
                setattr(chatbot_to_update, k, v)

            chatbot_to_update.updated_at = datetime.now()
            await session.commit()
            return chatbot_to_update
        return None

    async def delete_chatbot(self, chatbot_uid: str, session: AsyncSession):
        """Xóa một chatbot"""
        chatbot_to_delete = await self.get_chatbot(chatbot_uid, session)
        if chatbot_to_delete.name == "Aime-RAG":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cannot delete Aime-RAG. This is default chatbot",
            )
        if chatbot_to_delete is not None:
            await session.delete(chatbot_to_delete)
            await session.commit()
            return {}
        else:
            return None
