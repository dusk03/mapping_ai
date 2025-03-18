from pydantic import BaseModel
from src.chatbot.schemas import ChatbotResponse
import uuid
from typing import Optional


class CreateBanPermission(BaseModel):
    user_uid: str
    chatbot_uid: str


class PermissionChatbot(ChatbotResponse):
    status: str
    permission_uid: Optional[uuid.UUID] = None
