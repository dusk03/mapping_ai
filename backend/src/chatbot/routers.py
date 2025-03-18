from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.main import get_session
from src.auth.dependencies import RoleChecker
from src.chatbot.schemas import (
    ChatbotBase,
    ChatbotCreate,
    ChatbotUpdate,
    ChatbotResponse,
)
from typing import List
from src.chatbot.service import ChatbotService
from src.auth.dependencies import AccessTokenBearer

role_checker_admin = Depends(RoleChecker(["admin"]))
role_checker_user = Depends(RoleChecker(["user"]))

chatbot_router = APIRouter()
chatbot_service = ChatbotService()  # Khởi tạo service


@chatbot_router.get(
    "/user", response_model=List[ChatbotResponse], dependencies=[role_checker_user]
)
async def get_all_chatbots(
    user_detail: dict = Depends(AccessTokenBearer()),
    session: AsyncSession = Depends(get_session),
):
    """
    Lấy danh sách tất cả các chatbot.
    """
    user_uid = user_detail["user"]["user_uid"]

    chatbots = await chatbot_service.get_all_chatbots(user_uid, session)
    return chatbots


@chatbot_router.get(
    "/admin",
    response_model=List[ChatbotResponse],
    dependencies=[role_checker_admin],
)
async def get_all_chatbots_admin(session: AsyncSession = Depends(get_session)):
    """
    Lấy danh sách tất cả các chatbot.
    """
    chatbots = await chatbot_service.get_all_chatbots_admin(session)
    return chatbots


@chatbot_router.post(
    "/admin",
    response_model=ChatbotResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[role_checker_admin],
)
async def create_new_chatbot(
    chatbot_detail: ChatbotCreate, session: AsyncSession = Depends(get_session)
):
    """
    Tạo mới một chatbot.
    Chỉ admin có quyền thực hiện.
    """
    new_chatbot = await chatbot_service.create_chatbot(chatbot_detail, session)
    return new_chatbot


@chatbot_router.patch(
    "/admin/{chatbot_id}",
    response_model=ChatbotUpdate,
    dependencies=[role_checker_admin],
)
async def update_chatbot(
    chatbot_id: str,
    chatbot_data: ChatbotUpdate,
    session: AsyncSession = Depends(get_session),
):
    """
    Cập nhật thông tin một chatbot cụ thể.
    Chỉ admin có quyền thực hiện.
    """
    updated_chatbot = await chatbot_service.update_chatbot(
        chatbot_id, chatbot_data, session
    )
    if not updated_chatbot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found"
        )
    return updated_chatbot


@chatbot_router.delete(
    "/admin/{chatbot_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[role_checker_admin],
)
async def delete_chatbot(chatbot_id: str, session: AsyncSession = Depends(get_session)):
    """
    Xóa một chatbot cụ thể.
    Chỉ admin có quyền thực hiện.
    """

    result = await chatbot_service.delete_chatbot(chatbot_id, session)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Chatbot not found"
        )
    return None
