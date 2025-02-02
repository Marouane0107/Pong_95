FROM python:3.8-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/pingpong_95

# Set the working directory
WORKDIR /pingpong_95

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project
COPY . .

# Make the entrypoint script executable
RUN chmod +x scripts/entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["./scripts/entrypoint.sh"]