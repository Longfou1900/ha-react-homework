#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "          SYSTEM HEALTH REPORT            "
echo "=========================================="
echo "Hostname:    $(hostname)"
echo "IP Address:  $(hostname -I | awk '{print $1}')"
echo "Uptime:      $(uptime -p)"
echo "------------------------------------------"
echo "Memory Usage:"
free -h
echo "------------------------------------------"
echo "Disk Usage:"
df -h /
echo "=========================================="