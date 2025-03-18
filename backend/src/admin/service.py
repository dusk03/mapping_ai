from sqlmodel.ext.asyncio.session import AsyncSession
from .schemas import CreateBanPermission, PermissionChatbot
from ..db.models import Chatbot, PermissionUserChatbot
from sqlmodel import select, delete
from typing import List
from src.chatbot.schemas import ChatbotResponse
import uuid


class AdminService:
    async def ban_permission(self, data: CreateBanPermission, session: AsyncSession):
        ban_permission_data = data.model_dump()
        new_ban = PermissionUserChatbot(**ban_permission_data)
        session.add(new_ban)
        await session.commit()
        await session.refresh(new_ban)
        return new_ban

    async def get_chatbots_user(
        self, user_uid: str, session: AsyncSession
    ) -> List[PermissionChatbot]:

        result = await session.exec(
            select(PermissionUserChatbot.chatbot_uid, PermissionUserChatbot.uid).where(
                PermissionUserChatbot.user_uid == user_uid
            )
        )

        allowed = {row[0]: row[1] for row in result.all()}

        result = await session.exec(select(Chatbot))
        chatbots = result.all()

        chatbots_with_permission = [
            PermissionChatbot(
                **chatbot.dict(),
                status="able" if chatbot.uid in allowed else "disable",
                permission_uid=allowed.get(chatbot.uid)
            )
            for chatbot in chatbots
        ]

        return chatbots_with_permission

    async def delete_permission(self, permission_uid: uuid.UUID, session: AsyncSession):
        result = await session.exec(
            select(PermissionUserChatbot).where(
                PermissionUserChatbot.uid == permission_uid
            )
        )
        permission = result.one_or_none()

        if not permission:
            return False

        statement = delete(PermissionUserChatbot).where(
            PermissionUserChatbot.uid == permission_uid
        )
        await session.exec(statement)
        await session.commit()
        return True
