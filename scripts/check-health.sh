#!/usr/bin/env bash
set -uo pipefail

WEB_01="192.168.56.20"
WEB_02="192.168.56.21"
PORT="3000"

check_endpoint() {
    local host="$1"
    local url="http://${host}:${PORT}/health"
    echo "Checking health for $host..."
    if curl -s --max-time 3 "$url" | grep -q "UP"; then
        echo " [OK] $host is healthy."
        return 0
    else
        echo " [FAIL] $host is unresponsive or unhealthy."
        return 1
    fi
}

echo "=== Backend Health Status Report ==- "
check_endpoint "$WEB_01" || true
check_endpoint "$WEB_02" || true