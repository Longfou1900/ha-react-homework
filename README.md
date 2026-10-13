# Highly Available React.js Infrastructure

This project demonstrates a production-grade High Availability (HA) web architecture deployed using Vagrant, VirtualBox, Ubuntu 24.04 LTS, Node.js/React.js, systemd, HAProxy, Keepalived, and Bash automation scripts.

## Architecture Overview
- **Virtual IP (VIP)**: `192.168.56.100` (Managed by Keepalived)
- **Load Balancers**: 
  - `lb-01` (`192.168.56.10` - MASTER)[cite: 1, 2]
  - `lb-02` (`192.168.56.11` - BACKUP)[cite: 1, 2]
- **Web Servers**: 
  - `web-01` (`192.168.56.20` - Port 3000)[cite: 1, 2]
  - `web-02` (`192.168.56.21` - Port 3000)[cite: 1, 2]

## Quick Start Instructions
1. Clone the repository and navigate to `ha-react-homework/`.
2. Provision virtual machines:
   ```bash
   vagrant up