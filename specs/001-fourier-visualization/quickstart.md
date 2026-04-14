# Quickstart: Fourier Series Tool

## 1. Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.11+ (for local backend dev)

## 2. Running with Docker Compose
To start the entire application (Frontend + Backend):
```bash
docker-compose up --build
```
Access the UI at `http://localhost:3000`.

## 3. Local Development

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn src.main:app --reload
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

## 4. Verification
Run backend tests:
```bash
cd backend
pytest
```

Run frontend tests:
```bash
cd frontend
npm run test
```
