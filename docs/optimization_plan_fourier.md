# Plan de Optimización: Módulo de Fourier

Este documento detalla la estrategia para mejorar el rendimiento del generador de Series de Fourier, abordando los cuellos de botella identificados en el cálculo simbólico y la visualización.

## 1. Diagnóstico de Cuellos de Botella
- **Integración Simbólica (SymPy)**: El uso de `sp.integrate` con funciones `Piecewise` es extremadamente costoso computacionalmente, especialmente para $n$ armónicos cuando la expresión es compleja.
- **Simplificación Simbólica**: `sp.simplify` y `sp.nsimplify` añaden latencia significativa al intentar generar LaTeX "bonito".
- **Bloqueo del Event Loop**: FastAPI ejecuta las tareas de cálculo en el hilo principal (aunque sea `async`, si la función no es cooperativa, bloquea).
- **Detección de Simetría**: La comparación de `f(x)` vs `f(-x)` mediante `simplify` puede tardar varios segundos.

## 2. Acciones Inmediatas (Backend)

### A. Fallback a Integración Numérica
Implementar un decorador o lógica de timeout para `sp.integrate`. Si la integración simbólica excede los 2 segundos, abortar y usar `scipy.integrate.quad` para obtener los valores numéricos necesarios para el gráfico, devolviendo una representación simbólica simplificada o un mensaje de "Complejidad Alta".

### B. Ejecución en Hilos/Procesos
Mover las llamadas a `FourierSeriesCalculator` a un `ThreadPoolExecutor` (o `ProcessPoolExecutor` para evitar el GIL) usando `run_in_executor` de `asyncio`. Esto permitirá que el servidor responda a otras peticiones mientras calcula.

### C. Optimización de Simetría
En lugar de `simplify(f(x) - f(-x))`, evaluar la función en una serie de puntos aleatorios simétricos (ej. $x = 0.5, -0.5, 1.2, -1.2$). Si todos coinciden, entonces proceder a la verificación simbólica. Esto descarta el 90% de los casos "Ninguna" instantáneamente.

### D. Caché de Coeficientes
Implementar `lru_cache` para las expresiones parseadas y los resultados de integración para funciones idénticas.

## 3. Acciones en el Frontend (Mobile-First)

### A. Progressive Loading
Solicitar primero los primeros 5 armónicos para mostrar un gráfico inicial rápido y luego solicitar hasta 100 en segundo plano o bajo demanda ("Aumentar resolución").

### B. Optimización de Plotly
Reducir el número de puntos (`points`) a 300-500 en dispositivos móviles. La diferencia visual es mínima en pantallas pequeñas pero el renderizado es mucho más fluido.

## 4. Prompt de Optimización Especializado

Para delegar esta tarea a un agente de codificación, utiliza el siguiente prompt:

```text
Optimiza el backend de Fourier en 'backend/src/core/fourier.py' siguiendo estas directrices:
1. Reemplaza la integración puramente simbólica por un esquema híbrido: intenta 'sp.integrate' con un timeout de 1s, si falla o tarda demasiado, usa integración numérica (scipy/numpy) para los valores del gráfico.
2. Optimiza 'detect_symmetry' evaluando puntos numéricos antes de intentar simplificación simbólica costosa.
3. Asegura que los cálculos pesados no bloqueen el event loop de FastAPI usando 'run_in_executor'.
4. Implementa caché para el parsing de expresiones y cálculos repetitivos.
5. En 'evaluate_plot_data', optimiza el uso de 'np.dot' y 'np.outer' para asegurar que el cálculo de 100 armónicos sea instantáneo una vez obtenidos los coeficientes.
6. Refactoriza para que el código sea más robusto ante funciones no integrables simbólicamente.
```

## 5. Próximos Pasos
1. Implementar el fallback numérico en `backend/src/core/fourier.py`.
2. Modificar el endpoint en `endpoints.py` para usar `run_in_executor`.
3. Validar con el test de rendimiento existente (`tests/unit/test_performance.py`).
