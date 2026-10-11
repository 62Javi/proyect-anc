"""
Test de verificación automática de la regla de notación matemática (LaTeX / KaTeX).

Garantiza que ningún componente del frontend utilice caracteres Unicode para subíndices/superíndices
(como ₀, ₁, ₂, ᵢ, ₙ, Δx) en texto plano, ni filtre sintaxis cruda de fórmulas sin renderizar con KaTeX
(<InlineMath> o <MathText>).
"""

import os
import re
from pathlib import Path
import pytest

# Caracteres matemáticos Unicode prohibidos en texto plano de componentes
FORBIDDEN_UNICODE_CHARS = [
    '₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉',
    'ᵢ', 'ₙ',
    'Δx', 'Δt'
]

# Archivos exceptuados (el propio parser de MathText que convierte estos caracteres a LaTeX)
EXEMPT_FILES = {
    'MathText.tsx',
    'InlineMath.tsx',
}

def get_frontend_src_dir() -> Path:
    # Determinar si estamos dentro del contenedor (/app/tests/unit) o en el host
    current_file = Path(__file__).resolve()
    
    # 1. En el host: /home/sixto/projects/proyect-anc/backend/tests/unit/test_...
    host_frontend = current_file.parents[3] / "frontend" / "src"
    if host_frontend.exists():
        return host_frontend
        
    # 2. En el contenedor docker: /app/tests/unit/test_... -> /frontend/src no está directamente mapeado en backend,
    # pero si backend está mapeado a /app, verificar si existe ../frontend/src
    alt_frontend = Path("/app/../frontend/src").resolve()
    if alt_frontend.exists():
        return alt_frontend
        
    # 3. Path directo /home/sixto/projects/proyect-anc/frontend/src
    direct_path = Path("/home/sixto/projects/proyect-anc/frontend/src")
    if direct_path.exists():
        return direct_path

    return host_frontend


def test_no_raw_unicode_math_in_frontend_components():
    """Verifica que ningún archivo .tsx/.ts en frontend/src contenga subíndices Unicode en texto plano."""
    frontend_src = get_frontend_src_dir()
    if not frontend_src.exists():
        pytest.skip(f"Frontend src directory not found at {frontend_src} (posiblemente ejecutando dentro de contenedor con backend aislado)")

    violations = []

    for root, _, files in os.walk(frontend_src):
        for file in files:
            if not file.endswith(('.tsx', '.ts')):
                continue
            if file in EXEMPT_FILES:
                continue

            filepath = Path(root) / file
            rel_path = filepath.relative_to(frontend_src)

            with open(filepath, 'r', encoding='utf-8') as f:
                for line_num, line in enumerate(f, 1):
                    for char in FORBIDDEN_UNICODE_CHARS:
                        if char in line:
                            violations.append(
                                f"{rel_path}:{line_num} contiene '{char}': {line.strip()}"
                            )

    assert not violations, (
        f"Se encontraron {len(violations)} violaciones a la Regla de Notación Matemática (LaTeX/KaTeX):\n"
        + "\n".join(violations)
        + "\n\nSolución: Usa <InlineMath math='...' /> o <MathText text='...' /> en lugar de caracteres Unicode directos."
    )


def test_taylor_components_use_katex_components():
    """Verifica que todos los componentes del módulo de Taylor importen y usen InlineMath o MathText."""
    frontend_src = get_frontend_src_dir()
    if not frontend_src.exists():
        pytest.skip("Frontend src directory not accessible from current environment")

    taylor_dir = frontend_src / "components" / "taylor"
    if not taylor_dir.exists():
        pytest.skip(f"Taylor directory not found at {taylor_dir}")

    required_imports = ("InlineMath", "MathText")

    for file in taylor_dir.glob("*.tsx"):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        has_math_import = any(imp in content for imp in required_imports)
        assert has_math_import, (
            f"El componente {file.name} del módulo de Taylor no importa ni InlineMath ni MathText. "
            "Todo componente pedagógico de Taylor debe formatear la notación con KaTeX."
        )


def test_no_raw_latex_leaks_in_jsx_text():
    """Verifica que no haya sintaxis LaTeX cruda tipo _{n+1} o \\frac filtrada directamente en texto JSX."""
    frontend_src = get_frontend_src_dir()
    if not frontend_src.exists():
        pytest.skip("Frontend src directory not accessible")

    # Patrón de sintaxis LaTeX como _{n+1} fuera de comillas de props
    raw_subscript_leak = re.compile(r'>[^<]*_\{[a-zA-Z0-9+]+\}[^<]*<')

    violations = []
    for root, _, files in os.walk(frontend_src):
        for file in files:
            if not file.endswith('.tsx'):
                continue
            if file in EXEMPT_FILES:
                continue

            filepath = Path(root) / file
            rel_path = filepath.relative_to(frontend_src)

            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                matches = raw_subscript_leak.findall(content)
                if matches:
                    violations.append(f"{rel_path}: {matches}")

    assert not violations, (
        f"Se encontraron etiquetas JSX con sintaxis LaTeX cruda sin procesar por KaTeX:\n"
        + "\n".join(violations)
    )
