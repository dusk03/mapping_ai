import asyncio
from datetime import datetime
from src.config import Config
from src.db.main import get_session
from src.chatbot.service import ChatbotService
from src.chatbot.schemas import ChatbotCreate
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.db.models import Chatbot


async def create_chatbot():
    async for session in get_session():
        code_name = "aime-rag"

        statement = select(Chatbot).where(Chatbot.code_name == code_name)
        result = await session.exec(statement)
        existing_chatbot = result.first()

        if not existing_chatbot:
            chatbot_data = Chatbot(
                name="Aime-RAG",
                version="v1",
                description="Default chatbot for Aime RAG",
                code_name=code_name,
                chat_with_file=True,
            )
            session.add(chatbot_data)
            await session.commit()
            print("✅ Default chatbot created.")
        else:
            print("ℹ️ Default chatbot already exists.")


if __name__ == "__main__":
    asyncio.run(create_chatbot())
