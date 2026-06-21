from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from contextlib import asynccontextmanager

from app.db.database import create_tables
from app.api.routes import monitors, alerts, logs, dashboard, auth
from app.api.routes.auth import verify_token
from app.core.scheduler import start_scheduler, stop_scheduler
from app.utils.config import ALLOWED_ORIGIN
from app.utils.helper import admin_authentication

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    await start_scheduler()
    yield
    await stop_scheduler()


app = FastAPI(
    title="Production Monitoring System",
    description="AI-Powered Server Monitoring with WhatsApp Alerts",
    version="1.0.0",
    lifespan=lifespan,
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGIN,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#-----------------DOCS LOCK--------------------------------

"""Setting include_in_schema=False hides that specific endpoint 
from the automatic interactive documentation (like Swagger UI).
The endpoint remains fully functional and accessible via code,
 but it just won't be visible on the /docs page."""
@app.get("/openapi.json", include_in_schema=False)
async def get_open_api_endpoint(username: str = Depends(admin_authentication)):
    # Agar pehle se openapi generate ho chuki hai to dubara mehnat na kare
    if app.openapi_schema:
        return app.openapi_schema
        
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description, 
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

@app.get("/docs",include_in_schema=False)
async def custom_swagger_ui(username : str = Depends(admin_authentication)):
    return get_swagger_ui_html(
        openapi_url="/openapi.json", 
        title=app.title + " - Swagger UI"
    )
# ------------------------------------------------------------


# Public — no token required
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])

# Protected — every call must include a valid Bearer token
app.include_router(
    dashboard.router, prefix="/api/dashboard", tags=["Dashboard"],
    dependencies=[Depends(verify_token)],
)
app.include_router(
    monitors.router, prefix="/api/monitors", tags=["Monitors"],
    dependencies=[Depends(verify_token)],
)
app.include_router(
    alerts.router, prefix="/api/alerts", tags=["Alerts"],
    dependencies=[Depends(verify_token)],
)
app.include_router(
    logs.router, prefix="/api/logs", tags=["Logs"],
    dependencies=[Depends(verify_token)],
)


@app.get("/")
async def root():
    return {"message": "Monitoring System Running!", "status": "ok"}


@app.get("/health")
async def health():
    return {"status": "healthy"}