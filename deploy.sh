#!/bin/bash
set -e

# ==============================================================================
# E-Numerak Monitoring System - VPS Deployment Script
# ==============================================================================

echo "=========================================================="
echo " Starting E-Numerak Monitoring System Deployment...      "
echo "=========================================================="

# 1. Check if backend/.env exists
if [ ! -f "backend/.env" ]; then
    echo "[!] Error: 'backend/.env' not found!"
    echo "    Please create 'backend/.env' from 'backend/.env.example' and configure your secrets."
    exit 1
fi

# 2. Ensure data directory exists for SQLite database persistence
mkdir -p data

# 3. Check for Docker & Docker Compose
if command -v docker &> /dev/null; then
    echo "[+] Docker found: $(docker --version)"
else
    echo "[!] Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# 4. Pull latest git changes (if in git repo)
if [ -d ".git" ]; then
    echo "[+] Pulling latest changes from Git..."
    git pull origin main || git pull origin master || echo "[!] Notice: git pull skipped or failed, continuing with local files."
fi

# 5. Build and run containers using docker/docker-compose.yml
echo "[+] Building and starting Docker containers from docker/docker-compose.yml..."
if docker compose version &> /dev/null; then
    docker compose -f docker/docker-compose.yml down --remove-orphans
    docker compose -f docker/docker-compose.yml up -d --build
elif command -v docker-compose &> /dev/null; then
    docker-compose -f docker/docker-compose.yml down --remove-orphans
    docker-compose -f docker/docker-compose.yml up -d --build
else
    echo "[!] Error: docker compose is not available."
    exit 1
fi

echo "[+] Waiting for services to become healthy..."
sleep 5

# 6. Check running containers
echo "=========================================================="
docker ps --filter "name=numerak-monitoring"
echo "=========================================================="
echo "[✓] Deployment completed successfully!"
echo "    - Frontend & API: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_VPS_IP')"
echo "    - API Docs (Auth required): http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_VPS_IP')/docs"
echo "=========================================================="
