#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="/var/log/setup-web.log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "[$(date)] Starting web server environment setup..."

# Update and install Node.js 20.x
sudo apt-get update -y
sudo apt-get install -y curl build-essential

if ! command -v node &> /dev/null; then
    echo "[$(date)] Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "[$(date)] Node.js version: $(node -v)"
echo "[$(date)] npm version: $(npm -v)"
echo "[$(date)] Setup completed successfully."