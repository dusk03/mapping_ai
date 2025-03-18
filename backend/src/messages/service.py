from sqlmodel.ext.asyncio.session import AsyncSession
from datetime import datetime
from sqlmodel import select, desc, asc
from src.db.models import Message, Conversation
from src.messages.schemas import MessageCreate, MessageUpdate


class MessageService:
    async def get_all_messages_by_conversation(
        self, conversation_uid: str, session: AsyncSession
    ):
        """Lấy danh sách tất cả tin nhắn theo Conversation UID, sắp xếp theo timestamp giảm dần"""
        statement = (
            select(Message)
            .where(Message.conversation_uid == conversation_uid)
            .order_by(asc(Message.timestamp))
        )
        result = await session.exec(statement)
        return result.all()

    async def get_message(self, message_uid: str, session: AsyncSession):
        """Lấy một tin nhắn cụ thể theo UID"""
        statement = select(Message).where(Message.uid == message_uid)
        result = await session.exec(statement)
        message = result.first()
        return message if message is not None else None

    async def create_message(
        self,
        message_data: MessageCreate,
        conversation: Conversation,
        session: AsyncSession,
    ):
        """Tạo một tin nhắn mới"""
        conversation_uid = conversation.uid
        message_data_dict = message_data.model_dump()
        message_data_dict["conversation_uid"] = conversation_uid
        new_message = Message(**message_data_dict)
        new_message.timestamp = datetime.now()
        session.add(new_message)
        await session.commit()
        await session.refresh(new_message)
        return new_message

    async def update_message(
        self, message_uid: str, update_data: MessageUpdate, session: AsyncSession
    ):
        """Cập nhật nội dung một tin nhắn"""
        message_to_update = await self.get_message(message_uid, session)
        if message_to_update is not None:
            update_data_dict = update_data.model_dump(exclude_unset=True)
            for k, v in update_data_dict.items():
                setattr(message_to_update, k, v)

            await session.commit()
            return message_to_update
        return None
