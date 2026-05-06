# TODO: Mejora del Parser de Expresiones Matemáticas

## Problema Detectado
Actualmente, el sistema utiliza `sympy.parsing.sympy_parser` para convertir las entradas de MathLive/LaTeX en expresiones de Python. Sin embargo, ciertas estructuras matemáticas complejas o formatos específicos de entrada fallan al ser procesados, devolviendo errores de "Invalid Expression".

## Casos de Fallo Identificados
- **Logaritmos**: Confusión entre `log` (base e) y `ln`. Necesidad de mapear `log10`, etc.
- **Funciones por Partes Complejas**: El anidamiento de `Piecewise` a veces genera errores de integración.
- **Notación de Valor Absoluto**: El reemplazo de barras `|x|` por `abs(x)` es mediante regex simple y puede fallar con expresiones anidadas como `||x|-1|`.
- **Potencias y Superíndices**: Asegurar que todos los `^` se conviertan correctamente a `**` incluso en formatos LaTeX.
- **Constantes**: Mejorar el soporte para `e`, `pi` (ya soportado pero sensible a mayúsculas/minúsculas).

## Propuesta de Solución
1.  **Parser de LaTeX dedicado**: Implementar un parser que convierta LaTeX directamente a SymPy (ej. usando `sympy.parsing.latex` que requiere `antlr4`).
2.  **Limpieza Previa (Sanitización)**: Crear una función de pre-procesamiento más robusta que maneje:
    - Espacios en blanco de LaTeX (`\ `).
    - Mapeo de nombres de funciones comunes de calculadoras a SymPy.
3.  **Feedback en Tiempo Real**: Validar la expresión en el backend mientras el usuario escribe (debounce) para mostrar un error antes de darle a "Analizar".

## Archivos Relacionados
- `backend/src/core/fourier.py`: Método `_parse_expression`.
- `frontend/src/pages/FourierPage.tsx`: Lógica de reemplazo básica antes del envío.
