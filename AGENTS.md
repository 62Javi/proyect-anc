# proyect-anc Development Guidelines

## Project Overview
Interactive web tool for Fourier Series calculation and visualization.

## Active Technologies
- **Backend**: Python 3.11+, FastAPI, SymPy, NumPy
- **Frontend**: TypeScript 5+, Node 20, React, Vite, Plotly.js, Tailwind CSS, KaTeX
- **Deployment**: Docker Compose (ARM64 optimized)

## Deployment Context (CRITICAL)
- **Host**: Raspberry Pi (`192.168.1.100`)
- **Backend Port**: `8003` (Internal `8000`)
- **Frontend Port**: `8083` (Internal `80`)
- **Cloudflare Tunnel**: `fourier.sixtor.site` -> `http://127.0.0.1:8083` (frontend) and `/api/*` -> `http://127.0.0.1:8003`.
- **Image Strategy**: Built locally on Pi due to network/arch specificities.

## Project Structure
```text
backend/
├── src/
│   ├── api/         # FastAPI routes
│   ├── core/        # Fourier logic (SymPy)
│   ├── models/      # Pydantic schemas
│   └── main.py      # Entry point
└── tests/           # Pytest suite

frontend/
├── src/
│   ├── components/  # React components
│   ├── services/    # API client
│   └── App.tsx      # Main application
└── tests/           # Vitest suite
```

## Common Commands

### Backend
- Run tests: `cd backend && pytest`
- Run server: `cd backend && uvicorn src.main:app --reload`
- Lint: `cd backend && ruff check .`

### Frontend
- Run tests: `cd frontend && npm run test`
- Run dev server: `cd frontend && npm run dev`
- Build: `cd frontend && npm run build`

### Deployment
- Deploy on Pi: `cd ~/proyect-anc && docker compose up -d --build`

## Recent Changes
- `001-fourier-visualization`: Implemented end-to-end Fourier series analyzer.
- `002-pi-deployment`: Optimized Docker for Raspberry Pi (ports 8003/8083) and configured Cloudflare Tunnel.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
