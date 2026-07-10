#!/bin/sh
set -e

SERVER_NAME="${SERVER_NAME:-localhost}"
CERT_DIR=/etc/nginx/ssl

mkdir -p "$CERT_DIR"

if [ ! -f "$CERT_DIR/cert.pem" ]; then
  case "$SERVER_NAME" in
    [0-9]*.[0-9]*.[0-9]*.[0-9]*)
      SAN="IP:$SERVER_NAME"
      ;;
    *)
      SAN="DNS:$SERVER_NAME"
      ;;
  esac

  openssl req -x509 -nodes -newkey rsa:2048 \
    -keyout "$CERT_DIR/key.pem" \
    -out "$CERT_DIR/cert.pem" \
    -days 3650 \
    -subj "/CN=$SERVER_NAME" \
    -addext "subjectAltName=$SAN"
fi

exec nginx -g "daemon off;"
