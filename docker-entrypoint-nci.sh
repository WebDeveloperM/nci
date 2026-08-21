#!/bin/sh
set -eu

NCI_AUTH_BASIC=$(printf '%s:%s' "$NCI_AUTH_USER" "$NCI_AUTH_PASS" | base64 | tr -d '\n')
export NCI_AUTH_BASIC

envsubst '${NCI_AUTH_BASIC}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
