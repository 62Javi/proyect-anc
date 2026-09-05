FROM python:3.11-slim

# Create non-root user for security
RUN adduser --disabled-password --gecos "" appuser
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source and set ownership
COPY . .
RUN chown -R appuser:appuser /app

USER appuser
EXPOSE 8000
CMD ["sh", "-c", "uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
