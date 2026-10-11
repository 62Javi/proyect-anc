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
5. **Método de Taylor para EDO (`/taylor`)**:
   - Tema 1 asignado al Grupo 1 (Problemas de Valor Inicial en EDOs de 1º orden).
   - Deducción analítica de la Ordenada Genérica para órdenes 1 a 4 con cálculo simbólico de derivadas de orden superior mediante SymPy (regla de la cadena multivariada).
   - Simulador interactivo con presets oficiales de cátedra (Práctica 05 y apunte de Ing. Amiconi).
   - Solución analítica exacta automática (`sp.dsolve`) para contrastar error absoluto y relativo.
   - Desglose paso a paso colapsable con sustitución en LaTeX y redacción pedagógica de cátedra.
   - Comparativa multimétodo en vivo: Taylor vs Euler (orden 1) vs Euler Mejorado (Heun) vs Runge-Kutta 2 (Amiconi).

## Mandatory Mathematical Typography Rule (LaTeX / KaTeX) (CRITICAL)
- **Zero Raw Unicode Math Policy**: PROHIBIDO terminantemente usar caracteres Unicode para subíndices o superíndices en texto plano (como `x₀`, `y₀`, `x₁`, `y₁`, `xᵢ`, `yᵢ`, `xₙ`, `yₙ`, `xf`, `y'`, `y''`, `Δx`, `Δt`, `r²`, `O(h²)`).
- **Zero Plain-Text Formulas Policy**: PROHIBIDO mostrar expresiones matemáticas o código crudo (ej: `y' = f(x, y)`, `y_{n+1}`, `N = (xf - x0)/h`, `Paso h`, `(xn, yn)`) como texto plano sin renderizar.
- **Mandatory KaTeX Components**:
  - Para cualquier variable, parámetro o fórmula en labels, headers de tablas, métricas o descripciones, usar SIEMPRE `<InlineMath math="..." />` (ej. `<InlineMath math="x_0" />`, `<InlineMath math="y(x_0) = y_0" />`, `<InlineMath math="x_f" />`, `<InlineMath math="h" />`, `<InlineMath math="\Delta x" />`, `<InlineMath math="y' = f(x, y)" />`, `<InlineMath math="y_{n+1}" />`).
  - Para párrafos con explicaciones pedagógicas o textos mixtos, usar `<MathText text="..." />` delimitando las fórmulas con `$ ... $` o `$$ ... $$`.
  - Para bloques destacados con etiqueta o paso principal, usar `FormulaDisplay`.
- **Automated Verification**:
  - El script `frontend/scripts/check-math-formatting.mjs` (ejecutable vía `npm run check-math` o `verify`) inspecciona estáticamente el árbol de componentes para detectar y bloquear cualquier fuga de caracteres Unicode o sintaxis LaTeX cruda.
  - Es obligatorio ejecutar `verify` (o `docker compose exec frontend npm run check-math`) antes de dar por terminada cualquier tarea.

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
│   ├── core/        # Lógica matemática (taylor.py, fourier.py, roots.py, regression.py, harmonics.py)
│   ├── models/      # Esquemas Pydantic para I/O (taylor.py, fourier.py, roots.py, ...)
│   └── main.py      # Entry point Uvicorn
└── tests/           # Pytest suite (test_taylor_logic.py, test_api_taylor.py, ...)

frontend/
├── src/
│   ├── components/  # Componentes compartidos y por módulo (taylor/, roots/, regression/)
│   ├── pages/       # Vistas principales por módulo
│   │   ├── HomePage.tsx
│   │   ├── taylor/           # Módulo de Taylor (TaylorPage.tsx)
│   │   ├── regression/       # Módulo de regresión (RegressionPage.tsx)
│   │   ├── roots/            # Módulo de raíces (RootsPage)
│   │   ├── FourierPage.tsx
│   │   └── HarmonicAnalysisPage.tsx
│   ├── services/    # Clientes de API REST (api.ts)
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
- `008-taylor-ode-module`: Implemented end-to-end Initial Value Problem (IVP/PVI) ODE Solver using Taylor's method (Group 1 topic), featuring automated symbolic derivative derivation via SymPy, exact analytic solution contrast, Amiconi pedagogical step-by-step substitution, official UTN FRLP TP5 presets, and live multi-method benchmark (Taylor vs Euler vs Heun vs RK2).
- `009-latex-typography-rule-and-taylor-math-formatting`: Codified mandatory Zero Raw Unicode Math policy in GEMINI.md, integrated automated verification script (`npm run check-math` & Universal `verify`), and comprehensively overhauled all Taylor module components (solver inputs, metrics cards, accordion steps, theoretical proofs, and exercises) with KaTeX typography (`<InlineMath>` and `<MathText>`).

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->

