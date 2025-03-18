import json
import httpx
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.models import Conversation
from src.messages.service import MessageService
from src.messages.schemas import MessageCreate, MessageBase
from fastapi import Depends
from src.db.main import get_session
from src.config import Config
import re
import ast

# Config API

API_URL = Config.URL_OPENROUTER
API_TOKEN = Config.API_TOKEN_OPENROUTER
HEADERS = {"Authorization": f"Bearer {API_TOKEN}", "Content-Type": "application/json"}

messages_service = MessageService()


async def stream_ai_response(
    message: str, conversation: Conversation, session: AsyncSession, model: str
):
    try:
        conversation_uid = conversation.uid
        history_orm = await messages_service.get_all_messages_by_conversation(
            conversation_uid, session
        )
        history = [MessageBase.model_validate(msg).model_dump() for msg in history_orm]

        history.append({"role": "user", "content": message})

        payload = {
            "model": model,
            "messages": history,
            "stream": True,
        }

        full_response = ""

        async with httpx.AsyncClient() as client:
            try:
                async with client.stream(
                    "POST", API_URL, headers=HEADERS, json=payload
                ) as response:
                    if response.status_code != 200:
                        error_msg = await response.aread()
                        yield f"\n❌ Server Error: {error_msg.decode('utf-8')}"
                        return

                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            data = line[6:].strip()

                            if data == "[DONE]":
                                break

                            try:
                                data_obj = json.loads(data)
                                content = data_obj["choices"][0]["delta"].get("content")
                                if content:
                                    full_response += content
                                    yield content
                            except json.JSONDecodeError as e:
                                yield f"\n❌ JSON Decode Error: {e}"
                                return

            except Exception as e:
                yield f"\n❌ Error: {str(e)}"
                return

        if full_response:
            await messages_service.create_message(
                message_data=MessageCreate(role="assistant", content=full_response),
                conversation=conversation,
                session=session,
            )
    finally:
        await session.close()


RAG_API_URL = "http://103.252.2.156:2000/rag/answer?collection=questions"


async def stream_aime_rag(
    message: str, conversation: Conversation, session: AsyncSession
):
    try:
        payload = {
            "question": message,
            "stream": True,
        }

        full_response = ""

        async with httpx.AsyncClient() as client:
            try:
                async with client.stream("POST", RAG_API_URL, json=payload) as response:
                    if response.status_code != 200:
                        error_msg = await response.aread()
                        yield f"\n❌ Server Error: {error_msg.decode('utf-8')}"
                        return

                    async for line in response.aiter_lines():
                        line = line.strip()
                        if not line:
                            continue  # Bỏ qua dòng trống

                        # Kiểm tra dấu hiệu kết thúc stream
                        if line == "[DONE]":
                            break

                        if line.startswith("data: "):
                            line = line[6:].strip()  # Loại bỏ "data: "

                        try:
                            # Chỉ sử dụng ast.literal_eval nếu dòng không phải là '[DONE]'
                            if line == "[DONE]":
                                continue

                            # Chuyển từ chuỗi thành dict Python bằng ast.literal_eval
                            data_obj = ast.literal_eval(line)

                            if (
                                isinstance(data_obj, dict)
                                and "delta_answer" in data_obj
                            ):
                                content = data_obj["delta_answer"]
                                if content.strip():  # Bỏ qua nội dung trống
                                    full_response += content
                                    yield content
                            else:
                                yield f"\n❌ Unexpected response format: {data_obj}"

                        except (ValueError, SyntaxError) as e:
                            # Bỏ qua lỗi nếu không thể chuyển thành dict và tiếp tục xử lý tin nhắn tiếp theo
                            yield f"\n❌ Error: {e} | Raw Data: {repr(line)}"
                            continue  # Tiếp tục với các dòng dữ liệu tiếp theo

            except Exception as e:
                yield f"\n❌ Error: {str(e)}"
                return

        if full_response:
            # Lưu tin nhắn AI vào database sau khi hoàn thành response
            await messages_service.create_message(
                message_data=MessageCreate(role="assistant", content=full_response),
                conversation=conversation,
                session=session,
            )
    finally:
        await session.close()
