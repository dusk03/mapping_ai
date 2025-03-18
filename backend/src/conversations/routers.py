from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.main import get_session
from src.auth.dependencies import RoleChecker
from src.conversations.schemas import (
    ConversationCreate,
    ConversationUpdate,
    ConversationResponse,
    ConversationFullResponse,
    ConversationCreateResponse,
)
from typing import List
from src.conversations.service import ConversationService
from src.auth.dependencies import AccessTokenBearer
from src.conversations.dependencies import check_conversation_owner
from src.db.models import Conversation
from src.db.models import PermissionUserChatbot

role_checker_user = Depends(RoleChecker(["user"]))

conversation_router = APIRouter(dependencies=[role_checker_user])
conversation_service = ConversationService()


@conversation_router.get("/", response_model=List[ConversationResponse])
async def get_all_conversations_for_user(
    user: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    """
    Lấy danh sách tất cả các conversation của user hiện tại.
    """
    user_id = user["user"]["user_uid"]
    conversations = await conversation_service.get_all_conversations(user_id, session)
    return conversations


@conversation_router.get("/{conversation_uid}", response_model=ConversationFullResponse)
async def get_detail_conversation(
    conversation: Conversation = Depends(check_conversation_owner),
    session: AsyncSession = Depends(get_session),
):
    if conversation:
        conversation.messages.sort(key=lambda m: m.timestamp)
        return conversation

    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="conversation not found"
        )


@conversation_router.post(
    "/",
    response_model=ConversationCreateResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[role_checker_user],
)
async def create_new_conversation(
    conversation_detail: ConversationCreate,
    user: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    user_uid = user["user"]["user_uid"]
    permission = await conversation_service.check_ban(
        user_uid, conversation_detail.chatbot_uid, session
    )
    if permission == None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You cannot use this model"
        )
    new_conversation = await conversation_service.create_conversation(
        user_uid, conversation_detail, session
    )
    return new_conversation


@conversation_router.patch(
    "/{conversation_uid}",
    response_model=ConversationResponse,
    dependencies=[role_checker_user],
)
async def update_conversation(
    conversation_data: ConversationUpdate,
    conversation: Conversation = Depends(check_conversation_owner),
    session: AsyncSession = Depends(get_session),
):
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found"
        )
    updated_conversation = await conversation_service.update_conversation_title(
        conversation, conversation_data, session
    )

    return updated_conversation


@conversation_router.delete(
    "/{conversation_uid}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_conversation(
    conversation: Conversation = Depends(check_conversation_owner),
    session: AsyncSession = Depends(get_session),
):
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found"
        )

    await conversation_service.delete_conversation(conversation, session)
    return None
