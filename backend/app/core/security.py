from datetime import datetime, timedelta, timezone

import jwt

from app.utils.config import ACCESS_TOKEN_EXPIRE_MINUTES,SECRET_KEY

ALGORITHM = "HS256"


def create_access_token(expires_minutes: int | None = None) -> str:
    minutes = expires_minutes or ACCESS_TOKEN_EXPIRE_MINUTES
    expire = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    payload = {"sub": "dashboard", "exp": expire}
    return jwt.encode(payload,SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])