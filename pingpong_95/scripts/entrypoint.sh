#!/bin/bash

# Wait for postgres
echo "Waiting for PostgreSQL..."
while ! pg_isready -h $DB_HOST -p 5432 -q -U $DB_USER; do
  sleep 1
done

# Create/Apply migrations
echo "Making migrations..."
python manage.py makemigrations game

echo "Applying migrations..."
python manage.py migrate

echo "Creating superuser..."
python manage.py createsuperuser --noinput \
    --username admin \
    --email admin@gmail.com || true

# Start server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000