#!/usr/bin/env bash
set -euo pipefail

# APP_DIR="/home/ubuntu/ha-react-homework/react-app"
# APP_DIR="/vagrant/react-app"
APP_DIR="/home/vagrant/react-app"
LOG_FILE="/var/log/deploy-react.log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "[$(date)] Starting React application build and deployment..."

cd "$APP_DIR"

if [ ! -f "package.json" ]; then
    echo "Error: package.json not found in $APP_DIR" >&2
    exit 1
fi

echo "[$(date)] Installing npm dependencies..."
npm install

echo "[$(date)] Building React application..."
npm run build

echo "[$(date)] Restarting systemd service..."
# sudo cp /home/ubuntu/ha-react-homework/systemd/react-app.service /etc/systemd/system/react-app.service
sudo cp /vagrant/systemd/react-app.service /etc/systemd/system/react-app.service

echo "[$(date)] Reloading systemd..."
sudo systemctl daemon-reload

echo "[$(date)] Enabling and starting React application..."
sudo systemctl enable --now react-app

echo "[$(date)] Restarting React application..."
sudo systemctl restart react-app

echo "[$(date)] Deployment finished successfully."