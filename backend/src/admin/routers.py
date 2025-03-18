from fastapi import APIRouter, Depends, status
from ..auth.service import UserService
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.main import get_session
from fastapi.exceptions import HTTPException
from ..auth.dependencies import RoleChecker
from ..auth.service import UserService
from ..auth.schemas import UserModel
from typing import List
from .service import AdminService
from .schemas import CreateBanPermission
import uuid

role_checker = Depends(RoleChecker(["admin"]))
user_service = UserService()
admin_service = AdminService()
admin_router = APIRouter(dependencies=[role_checker])


@admin_router.get("/users", response_model=List[UserModel])
async def get_all_user(session: AsyncSession = Depends(get_session)):
    users = await user_service.get_all_user(session)
    return users


@admin_router.post("/permissions")
async def permission_user_chatbot(
    data_ban_permission: CreateBanPermission,
    session: AsyncSession = Depends(get_session),
):
    ban_permission = await admin_service.ban_permission(data_ban_permission, session)
    return ban_permission


@admin_router.delete("/permissions/{permission_uid}")
async def delete_permission(
    permission_uid: uuid.UUID, session: AsyncSession = Depends(get_session)
):
    success = await admin_service.delete_permission(permission_uid, session)
    if not success:
        raise HTTPException(status_code=404, detail="Permission not found")

    return {"message": "Permission deleted successfully"}


@admin_router.get("/chatbots/{user_uid}")
async def get_chatbots_user(
    user_uid: str, session: AsyncSession = Depends(get_session)
):
    chatbots = await admin_service.get_chatbots_user(user_uid, session)
    return chatbots
