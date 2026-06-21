"""
==============================================
Monitoring System - Project Structure Creator
==============================================
Just Run This file your whole project architecture will be created automatically
==============================================
"""

import os

ROOT = "monitoring-system"

# ---------- Folders ----------
FOLDERS = [
    f"{ROOT}/backend/app/api/routes",
    f"{ROOT}/backend/app/core",
    f"{ROOT}/backend/app/models",
    f"{ROOT}/backend/app/schemas",
    f"{ROOT}/backend/app/db/migrations",
    f"{ROOT}/frontend/src/components/Dashboard",
    f"{ROOT}/frontend/src/components/Monitors",
    f"{ROOT}/frontend/src/components/Alerts",
    f"{ROOT}/frontend/src/components/Logs",
    f"{ROOT}/frontend/src/pages",
    f"{ROOT}/frontend/src/services",
]

# ---------- Files ----------
FILES = [
    # Backend - app root
    f"{ROOT}/backend/app/__init__.py",
    f"{ROOT}/backend/app/main.py",
    f"{ROOT}/backend/app/config.py",

    # Backend - api
    f"{ROOT}/backend/app/api/__init__.py",
    f"{ROOT}/backend/app/api/routes/__init__.py",
    f"{ROOT}/backend/app/api/routes/monitors.py",
    f"{ROOT}/backend/app/api/routes/alerts.py",
    f"{ROOT}/backend/app/api/routes/logs.py",
    f"{ROOT}/backend/app/api/routes/dashboard.py",

    # Backend - core
    f"{ROOT}/backend/app/core/__init__.py",
    f"{ROOT}/backend/app/core/scheduler.py",
    f"{ROOT}/backend/app/core/monitor_engine.py",
    f"{ROOT}/backend/app/core/alert_engine.py",

    # Backend - models
    f"{ROOT}/backend/app/models/__init__.py",
    f"{ROOT}/backend/app/models/monitor.py",
    f"{ROOT}/backend/app/models/alert.py",
    f"{ROOT}/backend/app/models/log.py",

    # Backend - schemas
    f"{ROOT}/backend/app/schemas/__init__.py",
    f"{ROOT}/backend/app/schemas/monitor.py",
    f"{ROOT}/backend/app/schemas/alert.py",
    f"{ROOT}/backend/app/schemas/log.py",

    # Backend - db
    f"{ROOT}/backend/app/db/__init__.py",
    f"{ROOT}/backend/app/db/database.py",
    f"{ROOT}/backend/app/db/migrations/.gitkeep",

    # Backend - root files
    f"{ROOT}/backend/.env",
    f"{ROOT}/backend/requirements.txt",
    f"{ROOT}/backend/Dockerfile",

    # Frontend - components/Dashboard
    f"{ROOT}/frontend/src/components/Dashboard/StatusCard.jsx",
    f"{ROOT}/frontend/src/components/Dashboard/UptimeChart.jsx",
    f"{ROOT}/frontend/src/components/Dashboard/ResponseTime.jsx",

    # Frontend - components/Monitors
    f"{ROOT}/frontend/src/components/Monitors/MonitorList.jsx",
    f"{ROOT}/frontend/src/components/Monitors/MonitorForm.jsx",
    f"{ROOT}/frontend/src/components/Monitors/MonitorCard.jsx",

    # Frontend - components/Alerts
    f"{ROOT}/frontend/src/components/Alerts/AlertHistory.jsx",
    f"{ROOT}/frontend/src/components/Alerts/AlertSettings.jsx",

    # Frontend - components/Logs
    f"{ROOT}/frontend/src/components/Logs/LogViewer.jsx",

    # Frontend - pages
    f"{ROOT}/frontend/src/pages/Dashboard.jsx",
    f"{ROOT}/frontend/src/pages/Monitors.jsx",
    f"{ROOT}/frontend/src/pages/Alerts.jsx",
    f"{ROOT}/frontend/src/pages/Settings.jsx",

    # Frontend - services
    f"{ROOT}/frontend/src/services/api.js",

    # Frontend - root
    f"{ROOT}/frontend/src/App.jsx",
    f"{ROOT}/frontend/src/main.jsx",
    f"{ROOT}/frontend/package.json",
    f"{ROOT}/frontend/Dockerfile",

    # Project root
    f"{ROOT}/docker-compose.yml",
    f"{ROOT}/README.md",
]


def create_structure():
    print(f"Creating project structure inside: {ROOT}\n")

    # Create all folders first
    for folder in FOLDERS:
        os.makedirs(folder, exist_ok=True)

    # Create all empty files (also ensures parent folders exist)
    for file_path in FILES:
        parent = os.path.dirname(file_path)
        if parent:
            os.makedirs(parent, exist_ok=True)
        if not os.path.exists(file_path):
            with open(file_path, "w", encoding="utf-8"):
                pass  # just create an empty file

    print("Done! Structure created successfully.\n")
    print("Folder tree:\n")
    print_tree(ROOT)


def print_tree(start_path, prefix=""):
    entries = sorted(os.listdir(start_path))
    entries_count = len(entries)
    for index, entry in enumerate(entries):
        path = os.path.join(start_path, entry)
        connector = "└── " if index == entries_count - 1 else "├── "
        print(prefix + connector + entry)
        if os.path.isdir(path):
            extension = "    " if index == entries_count - 1 else "│   "
            print_tree(path, prefix + extension)


if __name__ == "__main__":
    create_structure()