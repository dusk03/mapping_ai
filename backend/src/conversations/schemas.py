from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime
from src.chatbot.schemas import ChatbotResponse
from src.messages.schemas import MessageResponse


class ConversationBase(BaseModel):
    title: Optional[str] = None
    user_uid: Optional[uuid.UUID]


class ConversationCreate(BaseModel):
    title: Optional[str] = None
    chatbot_uid: Optional[uuid.UUID]


class ConversationCreateResponse(ConversationCreate):
    uid: uuid.UUID


class ConversationUpdate(BaseModel):
    title: Optional[str]


class ConversationResponse(ConversationBase):
    uid: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConversationFullResponse(ConversationBase):
    chatbot: Optional[ChatbotResponse] = None
    messages: List[MessageResponse]
    pass
