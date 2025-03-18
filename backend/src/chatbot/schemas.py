from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime


class ChatbotBase(BaseModel):
    name: str
    version: Optional[str] = None
    description: Optional[str] = None


class ChatbotCreate(ChatbotBase):
    code_name: str
    chat_with_file: bool = False
    pass


class ChatbotUpdate(BaseModel):
    pass


class ChatbotResponse(ChatbotBase):
    uid: uuid.UUID
    code_name: str
    chat_with_file: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
