from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.database import create_tables
from app.api.routes import monitors, alerts, logs, dashboard, auth
from app.api.routes.auth import verify_token
from app.core.scheduler import start_scheduler, stop_scheduler


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
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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