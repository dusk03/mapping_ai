from passlib.context import CryptContext
from datetime import datetime, timedelta
from itsdangerous import URLSafeSerializer
import jwt
from src.config import Config
import uuid
import logging

passwd_context = CryptContext(schemes=["bcrypt"])

ACCESS_TOKEN_EXPIRY = 3600


def generate_passwd_hash(password: str) -> str:
    hash = passwd_context.hash(password)
    return hash


def verify_password(password: str, hash: str) -> bool:
    return passwd_context.verify(password, hash)


def create_access_token(
    user_data: dict, expiry: timedelta = None, refresh: bool = False
):
    expiry = expiry if expiry is not None else timedelta(seconds=ACCESS_TOKEN_EXPIRY)
    payload = {}
    payload["user"] = user_data
    payload["exp"] = datetime.now() + (expiry)
    payload["jti"] = str(uuid.uuid4())
    payload["refresh"] = refresh

    token = jwt.encode(
        payload=payload, key=Config.JWT_SECRET, algorithm=Config.JWT_AlGORITHM
    )

    return token


def decode_token(token: str) -> dict:
    try:
        token_data = jwt.decode(
            jwt=token, key=Config.JWT_SECRET, algorithms=[Config.JWT_AlGORITHM]
        )
        return token_data
    except Exception as e:
        logging.error("Invalid token")
        return None


serilizer = URLSafeSerializer(secret_key=Config.JWT_SECRET, salt="email-configuration")


def create_url_safe_token(data: dict):

    token = serilizer.dumps(data)
    return token


def decode_url_safe_token(token: str):
    try:
        token_data = serilizer.loads(token)
        return token_data
    except Exception as e:
        logging.error(str(e))
