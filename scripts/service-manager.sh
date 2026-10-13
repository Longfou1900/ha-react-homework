#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="react-app"

usage() {
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
}

if [ $# -ne 1 ]; then
    usage
fi

ACTION="$1"

case "$ACTION" in
    start|stop|restart|status)
        echo "Executing systemctl $ACTION on $SERVICE_NAME..."
        sudo systemctl "$ACTION" "$SERVICE_NAME"
        ;;
    *)
        echo "Invalid action: $ACTION"
        usage
        ;;
esac