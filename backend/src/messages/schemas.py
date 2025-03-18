from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime
from typing import List


class MessageBase(BaseModel):
    role: str
    content: str

    class Config:
        from_attributes = True


class MessageCreate(MessageBase):
    pass


class MessageUpdate(BaseModel):
    content: Optional[str]


class MessageResponse(MessageBase):
    uid: uuid.UUID
    timestamp: datetime

    class Config:
        from_attributes = True
