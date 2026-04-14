# Tasks: Fourier Series Interactive Visualization

**Input**: Design documents from `/specs/001-fourier-visualization/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test-First is explicitly requested in the Constitution Check (plan.md).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure for `backend/` and `frontend/` per implementation plan
- [X] T002 Initialize FastAPI project in `backend/` with `requirements.txt` (FastAPI, SymPy, Uvicorn, Pytest)
- [X] T003 Initialize React + Vite + TypeScript + Tailwind CSS project in `frontend/`
- [X] T004 [P] Configure Docker Compose in `docker-compose.yml` for backend and frontend
- [X] T005 [P] Configure linting and formatting (Ruff for Python, ESLint/Prettier for TS)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Setup API routing and CORS middleware in `backend/src/main.py`
- [X] T007 Define shared Pydantic models in `backend/src/models/fourier.py` per `data-model.md`
- [X] T008 [P] Implement base error handling and logging in `backend/src/core/exceptions.py`
- [X] T009 [P] Create API client service in `frontend/src/services/api.ts` based on `contracts/api.md`
- [X] T010 Setup testing framework configurations (`backend/pytest.ini` and `frontend/vitest.config.ts`)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Simple Periodic Function Analysis (Priority: P1) 🎯 MVP

**Goal**: Calculate and visualize Fourier series (first 10 harmonics) for a single-interval periodic function.

**Independent Test**: Enter `x` on `[-1, 1]`, click Calculate, see $a_n, b_n$ formulas and a plot with the original and approximation.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T011 [P] [US1] Unit test for symbolic coefficient calculation in `backend/tests/unit/test_fourier_logic.py`
- [X] T012 [P] [US1] Integration test for `/calculate` endpoint in `backend/tests/integration/test_api.py`
- [X] T013 [US1] Implement Fourier logic (analytical $a_n, b_n$ via SymPy) in `backend/src/core/fourier.py`
- [X] T014 [US1] Implement `/calculate` endpoint in `backend/src/api/endpoints.py`
- [X] T015 [US1] Create basic Plotly chart component in `frontend/src/components/FourierChart.tsx`
- [X] T016 [US1] Create function input form and results display in `frontend/src/App.tsx`
- [X] T017 [US1] Connect frontend form to `/calculate` API and render results

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Piecewise Function Analysis (Priority: P2)

**Goal**: Support functions defined in multiple sub-intervals.

**Independent Test**: Define $f(x)=1$ on `[-1, 0]` and $f(x)=-1$ on `[0, 1]`, see correct combined series and piecewise plot.

### Tests for User Story 2

- [X] T018 [P] [US2] Unit test for piecewise function integration in `backend/tests/unit/test_piecewise_logic.py`
- [X] T019 [US2] Update `backend/src/core/fourier.py` to handle `Piecewise` SymPy objects from multiple intervals
- [X] T020 [US2] Update `backend/src/models/fourier.py` and endpoint to accept multiple function/interval pairs
- [X] T021 [US2] Enhance `frontend/src/components/FunctionForm.tsx` to allow adding/removing interval rows
- [X] T022 [US2] Update frontend to handle and display piecewise function data in the plot

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Visualizing the Gibbs Phenomenon (Priority: P3)

**Goal**: Dynamically adjust harmonics up to 100 via a slider and observe the approximation change.

**Independent Test**: Move slider from 10 to 100, see plot update with more harmonics and characteristic "ringing" at discontinuities.

### Implementation for User Story 3

- [X] T023 [US3] Add a harmonic slider component in `frontend/src/components/HarmonicSlider.tsx` (limit 1-100)
- [X] T024 [US3] Implement dynamic re-calculation (or frontend-side sum evaluation if optimization allows) in `frontend/src/App.tsx`
- [X] T025 [US3] Ensure Plotly chart handles the updated point density smoothly

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T026 [P] Add LaTeX rendering for formulas using KaTeX in `frontend/src/components/FormulaDisplay.tsx`
- [X] T027 [P] Implement symmetry detection (Par/Impar) in `backend/src/core/fourier.py` and display it in UI
- [X] T028 Optimize Docker images for Raspberry Pi (multi-stage builds, ARM64 specific base images)
- [X] T029 Performance profiling on Raspberry Pi to ensure <5s calculation time
- [X] T030 Final documentation update in `README.md` and verify `quickstart.md` steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Foundation ready - No dependencies on other stories
- **User Story 2 (P2)**: Foundation ready - Integrates with US1 logic but extends it to piecewise
- **User Story 3 (P3)**: Foundation ready - Depends on US1/US2 being able to calculate and plot arbitrary harmonics

### Parallel Opportunities

- T004, T005 (Docker vs Linting)
- T008, T009 (Backend error handling vs Frontend API client)
- T011, T012 (Logic tests vs API tests)
- Once US1 is functional, US2 (Piecewise) and US3 (Slider) can potentially be worked on in parallel by different members if the core `fourier.py` interface is stable.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2 (Setup & Foundation)
2. Complete Phase 3 (US1: Single function, 10 harmonics)
3. **VALIDATE**: Run US1 tests. Confirm formula and plot rendering.

### Incremental Delivery

1. Add Piecewise support (US2) -> Validates complex integration logic.
2. Add Slider (US3) -> Validates performance and interactivity.
3. Apply Polish (KaTeX, Symmetry detection, Pi optimization).

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Test-First approach: T011, T012, T018 must pass (red-to-green)
- Use `lambdify` in `backend/src/core/fourier.py` as per `research.md` decision for performance.
