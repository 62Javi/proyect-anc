# proyect-anc Development Guidelines

## Project Overview
Interactive web tool for Fourier Series calculation and visualization.

## Active Technologies
- **Backend**: Python 3.11+, FastAPI, SymPy, NumPy
- **Frontend**: TypeScript 5+, Node 20, React, Vite, Plotly.js, Tailwind CSS, KaTeX
- **Deployment**: Docker Compose (ARM64 optimized)

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
- Full stack (Docker): `docker-compose up --build`

## Code Style
- **Python**: PEP 8 via Ruff
- **TypeScript**: Standard React/Vite conventions with ESLint/Prettier

## Recent Changes
- `001-fourier-visualization`: Implemented end-to-end Fourier series analyzer with symbolic math and interactive plots.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
