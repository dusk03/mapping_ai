from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.main import get_session
from src.auth.dependencies import RoleChecker, AccessTokenBearer
from src.messages.schemas import (
    MessageBase,
    MessageCreate,
    MessageUpdate,
    MessageResponse,
)
from typing import List
from src.messages.service import MessageService
from src.conversations.dependencies import check_conversation_owner
from src.db.models import Conversation

role_checker_user = Depends(RoleChecker(["user"]))

message_router = APIRouter(dependencies=[role_checker_user])
message_service = MessageService()


@message_router.get(
    "/{conversation_uid}",
    response_model=List[MessageResponse],
)
async def get_all_messages_by_conversation(
    conversation: Conversation = Depends(check_conversation_owner),
    session: AsyncSession = Depends(get_session),
):
    """
    Lấy danh sách tất cả tin nhắn trong một conversation (dành cho user).
    """
    conversation_uid = conversation.uid
    messages = await message_service.get_all_messages_by_conversation(
        conversation_uid, session
    )
    return messages


@message_router.post(
    "/{conversation_uid}",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_new_message(
    message_detail: MessageCreate,
    conversation: Conversation = Depends(check_conversation_owner),
    session: AsyncSession = Depends(get_session),
):
    """
    Tạo một tin nhắn mới.
    """

    new_message = await message_service.create_message(
        message_detail, conversation, session
    )
    return new_message


# @message_router.patch(
#     "/{conversation_uid}/{message_uid}",
#     response_model=MessageResponse,
# )
# async def update_message(
#     message_data: MessageUpdate,
#     message: Depends(check_message_owner),
#     session: AsyncSession = Depends(get_session),
# ):
#     """
#     Cập nhật một tin nhắn cụ thể theo UID.
#     """
#     updated_message = await message_service.update_message(
#         message, message_data, session
#     )
#     if not updated_message:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail="Message not found"
#         )
#     return updated_message
