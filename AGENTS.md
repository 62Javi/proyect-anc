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

## Active Modules
1. **Ajuste por Mínimos Cuadrados (`/regression`)**:
   - Estudio térmico del Caso 1 (Enfriamiento de Bebidas con 4 clusters de bebidas, Ley de Newton, jerarquía de aislación térmica, cálculo de residuos y $R^2$).
   - Solucionador interactivo genérico de regresión (lineal, polinómica, exponencial, potencial, homográfica) con presets de TP4.
   - Demostraciones analíticas de cátedra y ejercicios prácticos resueltos.
2. **Cálculo de Raíces (`/roots`)**:
   - Métodos numéricos para ecuaciones no lineales continuas (Newton-Raphson y Punto Fijo).
   - Duelo interactivo en vivo, visualizaciones gráficas interactivas (tangentes y telaraña/cobweb).
   - Resolución paso a paso colapsable con sustitución analítica en LaTeX.
3. **Analizador de Series de Fourier (`/fourier`)**:
   - Cálculo analítico (SymPy) y numérico de coeficientes $a_0, a_n, b_n$.
   - Detección automática de paridad/simetría, espectro de armónicos y reconstrucción de ondas periódicas y funciones por tramos.
4. **Análisis de Armónicos (`/harmonics`)**:
   - Procesamiento de audio/señales en tiempo real vía Web Audio API / FFT.
   - Detección de armónicos y frecuencias fundamentales sobre archivos de audio (.wav).

## Documentation Maintenance Rule (MANDATORY)
- **Actualización Obligatoria ante Cambios Grandes**: Al implementar **nuevos módulos**, refactorizaciones arquitecturales, adición de endpoints/dependencias clave o cambios en flujos principales, es **mandatorio actualizar este archivo `GEMINI.md`**:
  1. Registrar el módulo o capacidad en la sección `Active Modules`.
  2. Actualizar el árbol de `Project Structure` si hubo nuevas carpetas o servicios.
  3. Registrar la entrada secuencial en `Recent Changes` (ej. `007-...`).
- **Ajustes Menores**: Cambios cosméticos, de diseño puntual (paddings, colores, textos) o correcciones menores de bugs **NO** deben disparar modificaciones a `GEMINI.md` para evitar ruido documental.

## Project Structure
```text
backend/
├── src/
│   ├── api/         # Endpoints FastAPI centralizados (endpoints.py)
│   ├── core/        # Lógica matemática (fourier.py, roots.py, regression.py, harmonics.py, case1_data.json)
│   ├── models/      # Esquemas Pydantic para I/O
│   └── main.py      # Entry point Uvicorn
└── tests/           # Pytest suite

frontend/
├── src/
│   ├── components/  # Componentes compartidos (Layout, UI, Navbar)
│   ├── pages/       # Vistas principales por módulo
│   │   ├── HomePage.tsx
│   │   ├── FourierPage.tsx
│   │   ├── HarmonicAnalysisPage.tsx
│   │   ├── regression/       # Módulo de regresión (RegressionPage.tsx)
│   │   └── roots/            # Módulo de raíces (RootsPage, InteractiveSolver, TheorySection, ExercisesSection)
│   ├── services/    # Clientes de API REST
│   └── App.tsx      # Configuración de React Router
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
- `007-doc-sync-and-module-expansion-rule`: Synchronized GEMINI.md with all active modules, refined project structure, and codified mandatory rule for documentation updates upon major/structural changes.

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

