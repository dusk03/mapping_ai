from fastapi import FastAPI, Depends
from src.db.main import get_session
from src.db.models import Message
import uuid
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.conversations.dependencies import check_conversation_owner


async def check_message_onwer(
    message_uid: uuid.UUID, session: AsyncSession = Depends(get_session)
):
    statement = select(Message).where(Message.uid == message_uid)
    result = await session.exec(statement)
    message: Message = result.first()
    conversation_uid = message.conversation_uid
    check = check_conversation_owner(conversation_uid)
    if not check:
        return None
    return message
