#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  echo "Waiting for database..."
  until nc -z db 5432; do
    sleep 1
  done
fi

echo "Applying migrations..."
alembic upgrade head

echo "Starting API..."
exec "$@"
