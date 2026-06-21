from fastapi import HTTPException,status,Depends
from fastapi.security import HTTPBasicCredentials,HTTPBasic
from app.utils.config import DOCS_PASSWORD,DOCS_USERNAME

security=HTTPBasic()

def admin_authentication(credentials : HTTPBasicCredentials = Depends(security)):
    if credentials.username != DOCS_USERNAME or credentials.password != DOCS_PASSWORD:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username
