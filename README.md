# Fourier Series Tool

Interactive web application for calculating and visualizing Fourier series of periodic and piecewise functions.

## Features
- **Symbolic Calculation**: Analytical coefficients ($a_0, a_n, b_n$) using SymPy.
- **Piecewise Support**: Define functions across multiple intervals.
- **Dynamic Visualization**: High-density interactive plots with Plotly.js.
- **Gibbs Phenomenon**: Slider to observe convergence up to 100 harmonics.
- **Symmetry Detection**: Automatically detects Even/Odd functions.
- **LaTeX Rendering**: Mathematical formulas rendered with KaTeX.

## Tech Stack
- **Backend**: FastAPI (Python), SymPy, NumPy.
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Plotly.js, KaTeX.
- **Deployment**: Docker Compose (multi-stage builds for ARM64/Raspberry Pi).

## Quickstart

### Using Docker (Recommended)
```bash
docker-compose up --build
```
Access at `http://localhost:3000`.

### Local Development

#### Backend
1. `cd backend`
2. `python -m venv venv && source venv/bin/activate`
3. `pip install -r requirements.txt`
4. `uvicorn src.main:app --reload`

#### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Tests
- Backend: `cd backend && pytest`
- Frontend: `cd frontend && npm run test`
