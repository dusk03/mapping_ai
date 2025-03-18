from fastapi import FastAPI, APIRouter, Form, Depends, status
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.exceptions import HTTPException
from src.chatbot_test.service import stream_ai_response, stream_aime_rag
from src.db.models import Conversation
from src.db.main import get_session
from src.conversations.dependencies import check_conversation_owner
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.messages.service import MessageService
from src.messages.schemas import MessageCreate
from src.conversations.service import ConversationService

app = FastAPI()

chatbot_stream = APIRouter()
messages_service = MessageService()


@chatbot_stream.post("/chat")
@chatbot_stream.post("/chat/{conversation_uid}")
async def post_chat(
    conversation: Conversation = Depends(check_conversation_owner),
    message: str = Form(...),
    session: AsyncSession = Depends(get_session),
):
    """
    Endpoint xử lý POST request và trả về phản hồi kiểu streaming.
    """

    if conversation.chatbot == None:
        model = "mistralai/mistral-small-24b-instruct-2501:free"
    else:
        model = conversation.chatbot.code_name

    permission = await ConversationService().check_ban(
        conversation.user_uid, conversation.chatbot_uid, session
    )
    if permission == None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You cannot use this model"
        )
    await messages_service.create_message(
        message_data=MessageCreate(role="user", content=message),
        conversation=conversation,
        session=session,
    )

    if conversation.chatbot.code_name == "aime-rag":
        return StreamingResponse(
            stream_aime_rag(message, conversation, session),
            media_type="text/plain; charset=utf-8",
        )
    return StreamingResponse(
        stream_ai_response(message, conversation, session, model=model),
        media_type="text/plain; charset=utf-8",
    )
