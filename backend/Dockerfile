# Use Python 3.11 slim image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . .

# Change to Django project directory
WORKDIR /app/lab_sign_off

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Run migrations and start server
CMD ["sh", "-c", "python manage.py migrate && gunicorn lab_sign_off.wsgi:application --bind 0.0.0.0:8000"]