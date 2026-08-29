# Authentication Logic

from passlib.context import CryptContext
import secrets
import hashlib

# JWT
from jose import jwt
from datetime import datetime, timedelta, timezone

# Environment variables
import os
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()


# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


# Password reset token
def create_reset_token():
    return secrets.token_urlsafe(32)


# Hash reset token
def hash_reset_token(token: str):
    return hashlib.sha256(token.encode()).hexdigest()


# JWT Authentication

SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def verify_access_token(token: str):

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            return None

        return user_id

    except Exception:
        return None