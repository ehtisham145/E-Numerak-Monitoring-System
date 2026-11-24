# E-Numerak Monitoring System - VPS Deployment Guide

Yeh guide aapko E-Numerak Monitoring System ko VPS (Ubuntu/Debian) par deploy karne ke mukammal tareeqay batati hai.

---

## Table of Contents
1. [Method 1: Docker Compose Deployment (Recommended)](#method-1-docker-compose-deployment-recommended)
2. [Method 2: Direct VPS Deployment (Systemd + Nginx)](#method-2-direct-vps-deployment-systemd--nginx)
3. [Domain & SSL Setup (Certbot / HTTPS)](#domain--ssl-setup-certbot--https)
4. [Firewall (UFW) Configuration](#firewall-ufw-configuration)
5. [Troubleshooting & Common Issues](#troubleshooting--common-issues)

---

## Method 1: Docker Compose Deployment (Recommended)

Is method me sirf 1 command se backend, frontend, aur database sub setup ho jatay hain.

### Step 1: VPS par Docker install karein (agar pehle se nahi hai)
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Project Clone karein
```bash
cd /var/www  # ya apni pasandeeda directory
git clone <YOUR_REPOSITORY_URL>
cd E-Numerak-Monitoring-System
```

### Step 3: Backend Environment File Configure karein
```bash
cp backend/.env.example backend/.env
nano backend/.env
```
Neechay diye gaye variables zaroor set karein:
* `DASHBOARD_PASSWORD`: Dashboard login password (strong rakhein).
* `SECRET_KEY`: Random secret string (generate karein: `python3 -c "import secrets; print(secrets.token_hex(32))"`).
* `GREEN_API_INSTANCE_ID` & `GREEN_API_TOKEN` & `GREEN_API_URL`: Apne Green API credentials.
* `ALLOWED_ORIGIN`: Apne VPS ka IP ya domain (maslan: `http://YOUR_VPS_IP,https://yourdomain.com`).
* `DOCS_USERNAME` & `DOCS_PASSWORD`: Swagger docs ke login credentials.

### Step 4: Run Deploy Script
```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```
Ya direct docker compose run karein:
```bash
docker compose -f docker/docker-compose.yml up -d --build
# ya
cd docker && docker compose up -d --build
```

Ab aapka frontend aur API port `80` par live ho chuka hai!
* **App URL:** `http://YOUR_VPS_IP`
* **Swagger Docs:** `http://YOUR_VPS_IP/docs`

---

## Method 2: Direct VPS Deployment (Systemd + Nginx)

Agar aap Docker use nahi karna chahte aur direct host par chalana chahte hain:

### Step 1: System Packages Install karein
```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv nodejs npm nginx git
```

### Step 2: Code setup & Python Virtual Environment
```bash
cd /var/www/E-Numerak-Monitoring-System/backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cp .env.example .env
nano .env  # fill your credentials
```

### Step 3: Frontend Build karein
```bash
cd /var/www/E-Numerak-Monitoring-System/frontend
npm install
# Production build (relative /api routing ke saath):
npm run build
```
*(Build files `/var/www/E-Numerak-Monitoring-System/frontend/dist` me generate hongi)*

### Step 4: Systemd Service configure karein
Service file copy karein:
```bash
sudo cp /var/www/E-Numerak-Monitoring-System/deploy/monitoring-backend.service /etc/systemd/system/
```
*(Note: Service file ke andar `User=ubuntu` ko apne VPS user ke mutabiq verify karein)*

Service start aur enable karein:
```bash
sudo systemctl daemon-reload
sudo systemctl start monitoring-backend
sudo systemctl enable monitoring-backend
sudo systemctl status monitoring-backend
```

### Step 5: Nginx Reverse Proxy configure karein
```bash
sudo cp /var/www/E-Numerak-Monitoring-System/deploy/nginx-vps.conf /etc/nginx/sites-available/monitoring.conf
sudo nano /etc/nginx/sites-available/monitoring.conf # Apne domain ya IP update karein
sudo ln -s /etc/nginx/sites-available/monitoring.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## Domain & SSL Setup (Certbot / HTTPS)

Agar aapke paas domain hai (maslan: `monitor.e-numerak.com`):

1. Domain ke DNS me **A Record** add karein jo aapke VPS IP ko point kare.
2. Certbot install aur SSL issue karein:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d monitor.e-numerak.com
```
Certbot automatically Nginx configuration me SSL certificate aur HTTPS redirect configure kar dega.

---

## Firewall (UFW) Configuration

VPS par sirf zaroori ports open rakhein:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## Troubleshooting & Common Issues

1. **Containers ke logs dekhna:**
   ```bash
   docker compose logs -f backend
   docker compose logs -f frontend
   ```
2. **Database Persistence:**
   Database automatically `./data/monitoring.db` me save hota hai, is liye container restart ya rebuild karne par data mehfooz rehta hai.
3. **WhatsApp alerts delivery:**
   Verify karein ke `backend/.env` me `GREEN_API_URL` bilkul wahi hai jo aapke Green API console me show ho raha hai (e.g. `https://7105.api.green-api.com`).
