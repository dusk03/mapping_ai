from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.db.main import init_db
from src.auth.routers import auth_router
from .middleware import register_middleware
from .errors import register_all_errors
from src.chatbot.routers import chatbot_router
from src.conversations.routers import conversation_router
from src.chatbot_test.routes import chatbot_stream
from src.messages.routers import message_router
from src.admin.routers import admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("start server ...")
    await init_db()
    yield
    print("server has been stopped")


version = "v1"

app = FastAPI(
    title="ai_mapping",
    description="A REST API for a web ai mapping service",
    version=version,
)

register_middleware(app)
register_all_errors(app)


app.include_router(auth_router, prefix="/api/{version}/auth", tags=["auth"])

app.include_router(chatbot_stream, prefix="/api/{version}/stream", tags=["chat_test"])

app.include_router(chatbot_router, prefix="/api/{version}/chatbot", tags=["chatbot"])

app.include_router(
    conversation_router,
    prefix="/api/{version}/conversation/user",
    tags=["conversation"],
)

app.include_router(
    message_router, prefix="/api/{version}/message/user", tags=["message"]
)

app.include_router(admin_router, prefix="/api/{version}/admin", tags=["admin"])
