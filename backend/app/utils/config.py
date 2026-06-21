from dotenv import load_dotenv

import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL") 

GREEN_API_INSTANCE_ID = os.getenv("GREEN_API_INSTANCE_ID")

GREEN_API_TOKEN = os.getenv("GREEN_API_TOKEN")

SECRET_KEY = os.getenv("SECRET_KEY")

GREEN_API_URL = os.getenv("GREEN_API_URL")

CHECK_INTERVAL_SECONDS = 60

DASHBOARD_PASSWORD = os.getenv("DASHBOARD_PASSWORD")

ACCESS_TOKEN_EXPIRE_MINUTES = 15

DEBUG=True

raw_origins = os.getenv("ALLOWED_ORIGIN")

ALLOWED_ORIGINS = [origin.strip() for origin in raw_origins.split(",") if origin]


DOCS_USERNAME=os.getenv("DOCS_USERNAME")

DOCS_PASSWORD=os.getenv("DOCS_PASSWORD")