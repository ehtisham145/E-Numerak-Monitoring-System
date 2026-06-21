import secrets

import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.utils.config import DASHBOARD_PASSWORD , ACCESS_TOKEN_EXPIRE_MINUTES
from app.core.security import create_access_token, decode_access_token
from app.schemas.login import LoginRequest,LoginResponse

router = APIRouter()
bearer_scheme = HTTPBearer(auto_error=False)


@router.post("/login", response_model=LoginResponse)
async def login(data: LoginRequest):
    if not DASHBOARD_PASSWORD:
        raise HTTPException(
            status_code=500,
            detail="DASHBOARD_PASSWORD is not configured on the server.",
        )

    if not secrets.compare_digest(data.password, DASHBOARD_PASSWORD):
        raise HTTPException(status_code=401, detail="Incorrect password.")

    token = create_access_token()
    return LoginResponse(
        access_token=token,
        expires_in_minutes=ACCESS_TOKEN_EXPIRE_MINUTES,
    )


async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    try:
        decode_access_token(credentials.credentials)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid authentication token.")