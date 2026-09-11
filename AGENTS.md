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
- **Universal Verify (Global)**: Use the `verify` command in any project to auto-validate code. It supports Rust, Python, and Node.js. It helps me auto-correct my own errors before delivery.

## Docker-First Mandate (CRITICAL)
- **Primary Workflow (Local Development)**: Use `docker compose up -d` (or `docker compose -f docker-compose.dev.yml up -d`). It uses `docker-compose.yml` configured for instant Hot-Reload (Vite HMR on frontend and Uvicorn `--reload` on backend with mapped volumes).
- **Production (Raspberry Pi)**: In production, the frontend MUST use the production build (Nginx) via `docker-compose.prod.yml`. DO NOT use dev mode in production as it fails over Cloudflare tunnels. Command on Pi: `docker compose -f docker-compose.prod.yml up -d --build`.
- **Recommendation**: Discourage developers from running `uvicorn` or `npm dev` manually on their host machine. 
- **Support**: If a user lacks Docker, prioritize guiding them through Docker Desktop (Windows) or Docker Engine (Linux) installation instead of manual setup.

## Deployment Context & Port Configuration (CRITICAL)
- **Primary Host (Home/Local)**: Raspberry Pi (`192.168.1.100`)
  - **Backend**: `8003` (Internal `8000`)
  - **Frontend**: `8083` (Internal `80`)
  - **Cloudflare Tunnel**: `anc.sixtor.com` -> `http://127.0.0.1:8083` (frontend) and `/api/*` -> `http://127.0.0.1:8003`.
  - **Image Strategy**: Built locally on Pi due to network/arch specificities.
- **Failover Host (100% Free Cloud High-Availability)**:
  - **Frontend**: Cloudflare Pages (`anc2.sixtor.com` / `proyect-anc.pages.dev`).
  - **Backend**: Render Free Web Service (`https://proyect-anc.onrender.com`).
  - **Proxy Worker**: `frontend/public/_worker.js` automatically forwards `/api/*` to Render with zero CORS issues.
- **Local Development**: 
  - Developers may change external ports in `docker-compose.yml` (e.g., `8000:8000`) for local testing if needed.
  - **MANDATORY**: All changes must be reverted to `8003/8083` before pushing or deploying to the Raspberry Pi to maintain Cloudflare Tunnel compatibility.

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
- Deploy on Pi: `cd ~/proyect-anc && docker compose -f docker-compose.prod.yml up -d --build`
- Run local Dev: `docker compose up -d` (Hot-Reload instantáneo)

## Recent Changes
- `001-fourier-visualization`: Implemented end-to-end Fourier series analyzer.
- `002-pi-deployment`: Optimized Docker for Raspberry Pi (ports 8003/8083) and configured Cloudflare Tunnel.
- `003-multi-tool-restructuring`: Refactored frontend with React Router and established a multi-page architecture for future tools.
- `004-roots-step-by-step-latex`: Implemented clean collapsible step-by-step resolution with LaTeX formula substitutions for Newton iterations.
- `005-dev-hot-reload`: Enabled instant Hot-Reload (Vite HMR on frontend and Uvicorn --reload on backend) via Docker volumes and override configuration, eliminating image rebuilds during local development.
- `006-least-squares-regression-case1`: Implemented end-to-end Least Squares Regression module with complete study for Caso 1 (Drink Cooling analysis with 4 clusters, Newton cooling law, thermal insulation hierarchy, residuals plots), interactive generic regression solver with TP4 presets, theoretical proofs from cátedra, and solved practical exercises.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
