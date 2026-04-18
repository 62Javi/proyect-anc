# proyect-anc Development Guidelines

## Project Overview
Interactive web platform for Mathematical Analysis, Numerical Methods, and Calculus (ANC).
**Design Priority**: Mobile-First (Phone-First). All interfaces must be highly optimized for small touch screens and one-handed use before scaling to desktop.

## Active Technologies
- **Backend**: Python 3.11+, FastAPI, SymPy, NumPy
- **Frontend**: TypeScript 5+, Node 20, React, Vite, React Router, Tailwind CSS, Plotly.js, KaTeX
- **Deployment**: Docker Compose (ARM64 optimized)

## Specialized Skills (Installed in .agents/skills/)
- **UI/UX Pro Max**: MUST be used for all visual design decisions (colors, typography, spacing). Always prioritize mobile-specific rules and "Phone-First" philosophy.
- **Tavily Search/Research**: Use for deep technical investigations or finding updated documentation for backend libraries.
- **Universal Verify (Global)**: Use the `verify` command in any project to auto-validate code. It supports Rust, Python, and Node.js. It helps me auto-correct my own errors before delivery.

## Deployment Context (CRITICAL)
- **Host**: Raspberry Pi (`192.168.1.100`)
- **Backend Port**: `8003` (Internal `8000`)
- **Frontend Port**: `8083` (Internal `80`)
- **Cloudflare Tunnel**: `anc.sixtor.site` -> `http://127.0.0.1:8083` (frontend) and `/api/*` -> `http://127.0.0.1:8003`.
- **Image Strategy**: Built locally on Pi due to network/arch specificities.

## Project Structure
```text
backend/
├── src/
│   ├── api/         # FastAPI routers by tool
│   ├── core/        # Mathematical logic by tool (SymPy)
│   ├── models/      # Pydantic schemas
│   └── main.py      # Entry point
└── tests/           # Pytest suite

frontend/
├── src/
│   ├── components/  # Shared and tool-specific React components
│   ├── pages/       # Page-level components (Home, Fourier, etc.)
│   ├── services/    # API client
│   └── App.tsx      # Main application with Routing
└── tests/           # Vitest suite
```

## Common Commands

### Backend
- Run tests: `cd backend && pytest`
- Run server: `cd backend && uvicorn src.main:app --reload`
- Lint: `cd backend && ruff check .`

### Frontend
- Run tests: `cd frontend && npm run test`
- Run dev server: `cd frontend && npm run dev -- --host`
- Build: `cd frontend && npm run build`

### Deployment
- Deploy on Pi: `cd ~/proyect-anc && docker compose up -d --build`

## Recent Changes
- `001-fourier-visualization`: Implemented end-to-end Fourier series analyzer.
- `002-pi-deployment`: Optimized Docker for Raspberry Pi (ports 8003/8083) and configured Cloudflare Tunnel.
- `003-multi-tool-restructuring`: Refactored frontend with React Router and established a multi-page architecture for future tools.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
