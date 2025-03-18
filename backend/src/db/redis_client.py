import redis
from redis import asyncio as aioredis
from src.config import Config

JTI_EXPIRY = 3600

# Create an async Redis connection
token_blocklist = aioredis.from_url(Config.REDIS_URL)


async def add_jti_to_blocklist(jti: str) -> None:
    """Adds a JTI to the blocklist with an expiry time."""
    await token_blocklist.set(
        name=jti, value="", ex=JTI_EXPIRY
    )  # Use `ex` instead of `exp`


async def token_in_blocklist(jti: str) -> bool:
    """Checks if a JTI is in the blocklist."""
    return await token_blocklist.exists(jti) > 0
