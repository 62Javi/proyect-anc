FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.11-slim
# Create non-root user for security
RUN adduser --disabled-password --gecos "" appuser
WORKDIR /app

# Copy packages from builder to the new user's home
COPY --from=builder /root/.local /home/appuser/.local
ENV PATH=/home/appuser/.local/bin:$PATH

# Copy source and set ownership
COPY . .
RUN chown -R appuser:appuser /app

USER appuser
EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
