# E-numerak Monitoring System

A self-hosted monitoring platform for tracking the uptime and health of E-numerak's live services. The system checks configured endpoints on a fixed interval, records every check, and sends a WhatsApp alert the moment a service goes down or recovers.

## Overview

E-numerak runs production services on a VPS, including the invoicing system. This project provides continuous, automated visibility into that infrastructure without requiring direct server access: any HTTP endpoint can be added as a monitor, checked on a schedule, and tracked through a password-protected dashboard. When a monitor's status changes, a formatted alert is sent over WhatsApp to one or more configured numbers.

## Features

- **Automated health checks** — every active monitor is checked on a configurable interval (default: every 60 seconds).
- **WhatsApp alerts** — status changes (service down / service restored) trigger a formatted WhatsApp message via the Green API, with no emojis and professional wording suitable for stakeholder distribution.
- **Per-monitor configuration** — custom expected status code, alert toggle, and one or more WhatsApp recipients per monitor.
- **Dashboard** — live status overview, a per-service pulse visualization built from recent check history, response time trends, and a feed of recent alerts.
- **Monitor management** — add, edit, pause/resume, and delete monitors from the UI; no direct database or backend access required.
- **Alert history** — full log of every alert sent, filterable by type and delivery status.
- **Raw log viewer** — every individual health check (success, failure, or timeout) is retained and viewable.
- **Authentication** — the dashboard is protected by a single password defined in the backend environment configuration; sessions are issued as signed, expiring tokens.

## Tech Stack

**Backend**
- Python, FastAPI
- SQLAlchemy 2.0 (async) with SQLite
- APScheduler — scheduled monitoring job
- httpx — outbound health checks and WhatsApp API calls
- PyJWT — session token signing and verification
- Green API — WhatsApp message delivery

**Frontend**
- React 18, Vite
- React Router
- Tailwind CSS
- Recharts — response time charts
- Lucide React — icons

## Project Structure

```
E-numerak-Monitoring-System/
├── backend/
│   ├── app/
│   │   ├── main.py                  FastAPI application entry point
│   │   ├── config.py                Environment-driven settings
│   │   ├── api/routes/
│   │   │   ├── auth.py              Login endpoint, token verification
│   │   │   ├── monitors.py          Monitor CRUD and toggle
│   │   │   ├── alerts.py            Alert history endpoints
│   │   │   ├── logs.py              Health check log endpoints
│   │   │   └── dashboard.py         Aggregate stats endpoint
│   │   ├── core/
│   │   │   ├── scheduler.py         Periodic job runner
│   │   │   ├── monitor_engine.py    Performs the actual health checks
│   │   │   ├── alert_engine.py      Builds and sends WhatsApp alerts
│   │   │   └── security.py          JWT creation and decoding
│   │   ├── models/                  SQLAlchemy models (Monitor, Alert, Log)
│   │   ├── schemas/                 Pydantic request/response schemas
│   │   └── db/database.py           Database engine and session
│   ├── requirements.txt
│   └── .env                         Local configuration (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/           Status cards, pulse chart, response time chart
│   │   │   ├── Monitors/            Monitor list, card, and form
│   │   │   ├── Alerts/              Alert history and default-number settings
│   │   │   ├── Logs/                Log table
│   │   │   ├── Layout/              Sidebar and top bar
│   │   │   └── common/              Shared UI primitives
│   │   ├── pages/                   Login, Dashboard, Monitors, Alerts, Logs, Settings
│   │   ├── context/AuthContext.jsx  Session state, login/logout
│   │   ├── services/api.js          Backend API client
│   │   ├── utils/format.js          Time and text formatting helpers
│   │   └── App.jsx
│   ├── package.json
│   └── .env.local                   Local configuration (not committed)
│
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.11 or later
- Node.js 18 or later
- A Green API account and instance (for WhatsApp alert delivery)

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

pip install -r requirements.txt
```

Create a `.env` file in `backend/` (see [Environment Variables](#environment-variables) below), then start the server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`, with interactive documentation at `http://127.0.0.1:8000/docs`.

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

The dashboard will be available at `http://localhost:5173`. Sign in using the password configured in the backend's `DASHBOARD_PASSWORD` variable.

## Environment Variables

**Backend (`backend/.env`)**

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | SQLite connection string | `sqlite+aiosqlite:///./monitoring.db` |
| `GREEN_API_INSTANCE_ID` | Green API instance ID | `7105123456` |
| `GREEN_API_TOKEN` | Green API instance token | — |
| `GREEN_API_URL` | Green API base URL for your instance | `https://api.green-api.com` |
| `CHECK_INTERVAL_SECONDS` | How often monitors are checked | `60` |
| `DASHBOARD_PASSWORD` | Password required to sign in to the dashboard | — |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Session length before re-authentication is required | `720` |
| `SECRET_KEY` | Signing key for session tokens | — |
| `DEBUG` | Enables verbose SQL logging | `True` / `False` |

**Frontend (`frontend/.env.local`)**

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://127.0.0.1:8000` |

`GREEN_API_URL` must match the exact API host shown for your specific instance in the Green API console — this is not always `api.green-api.com` for every account, and using the wrong host will cause alert delivery to fail silently against an unrelated server.

## API Reference

All endpoints below except `/api/auth/login` require an `Authorization: Bearer <token>` header, obtained from the login endpoint.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate with the dashboard password, returns a session token |
| GET | `/api/monitors/` | List all monitors |
| POST | `/api/monitors/` | Create a monitor |
| GET | `/api/monitors/{id}` | Retrieve a single monitor |
| PUT | `/api/monitors/{id}` | Update a monitor |
| DELETE | `/api/monitors/{id}` | Delete a monitor |
| PATCH | `/api/monitors/{id}/toggle` | Pause or resume a monitor |
| GET | `/api/alerts/` | List all alerts |
| GET | `/api/alerts/monitor/{id}` | List alerts for a specific monitor |
| DELETE | `/api/alerts/clear` | Permanently delete all alert history |
| GET | `/api/logs/` | List the most recent health check logs |
| GET | `/api/logs/monitor/{id}` | List logs for a specific monitor |
| GET | `/api/dashboard/stats` | Aggregate counts: total/up/down monitors, total alerts and logs |

Full interactive documentation is generated automatically by FastAPI and available at `/docs` while the backend is running.

## Authentication

The dashboard uses a single shared password rather than individual user accounts, since it is intended for internal operational use. On login, the backend issues a signed JWT valid for `ACCESS_TOKEN_EXPIRE_MINUTES` (12 hours by default). The frontend stores this token and attaches it to every API request; if it expires, the user is automatically signed out and returned to the login page.

`SECRET_KEY` and `DASHBOARD_PASSWORD` should be unique, unguessable values in any environment beyond local development, and `backend/.env` should never be committed to version control.

## WhatsApp Alerts

Alert delivery is handled through Green API. When a monitor transitions from up to down, or from down to up, a message is generated and sent to every WhatsApp number configured on that monitor. Messages are written in formal English with no emojis, and include the service name, URL, previous and current status, response time, the detected issue (for down alerts), and a UTC timestamp.

To configure delivery:

1. Create an instance in the Green API console and link it to a WhatsApp number by scanning the QR code shown in the dashboard.
2. Copy the instance ID, token, and exact API URL into `backend/.env`.
3. Set one or more recipient numbers (with country code, no symbols) on each monitor you want alerts for.

Default recipient numbers can also be set once under **Settings** in the dashboard, which pre-fills new monitors but can still be overridden per monitor.

## Design Notes

The frontend's visual language is built around the idea that a monitoring tool is, functionally, checking whether something is alive — so the dashboard borrows from the visual grammar of a hospital vitals monitor. The signature element is a per-service pulse strip on the Dashboard page: a continuous waveform built from real check history, spiking on successful checks and flatlining on failure. Status colors are functional rather than decorative — green for up, red for down, amber for degraded — and all timestamps, URLs, and numeric data are set in a monospaced typeface to read as instrument output rather than prose.

## Production Notes

- Build the frontend for deployment with `npm run build`; the output in `frontend/dist/` can be served by any static host or a reverse proxy such as Nginx.
- Update `VITE_API_BASE_URL` to the backend's public address before building for production.
- Run the backend behind a process manager (e.g. `systemd`, `supervisor`, or a container orchestrator) rather than `--reload`, and restrict CORS to the known frontend origin instead of `*`.
- Back up `monitoring.db` periodically, or migrate to a managed database if usage grows beyond a single small team.

