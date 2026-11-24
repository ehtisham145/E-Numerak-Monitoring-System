from dotenv import load_dotenv

import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./monitoring.db")

GREEN_API_INSTANCE_ID = os.getenv("GREEN_API_INSTANCE_ID")

GREEN_API_TOKEN = os.getenv("GREEN_API_TOKEN")

SECRET_KEY = os.getenv("SECRET_KEY", "replace_with_a_long_random_string")

GREEN_API_URL = os.getenv("GREEN_API_URL", "https://api.green-api.com")

CHECK_INTERVAL_SECONDS = int(os.getenv("CHECK_INTERVAL_SECONDS", "60"))

DASHBOARD_PASSWORD = os.getenv("DASHBOARD_PASSWORD")

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "720"))

DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

raw_origins = os.getenv("ALLOWED_ORIGIN") or ""

ALLOWED_ORIGINS = [origin.strip() for origin in raw_origins.split(",") if origin]
if not ALLOWED_ORIGINS:
    ALLOWED_ORIGINS = ["*"]

DOCS_USERNAME = os.getenv("DOCS_USERNAME", "admin")

DOCS_PASSWORD = os.getenv("DOCS_PASSWORD", "admin")