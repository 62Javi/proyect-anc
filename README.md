# Plataforma de Análisis Numérico - UTN FRLP

Esta plataforma interactiva ha sido desarrollada como una herramienta de apoyo para la cátedra de Análisis Numérico de la Universidad Tecnológica Nacional, Facultad Regional La Plata (UTN FRLP). Proporciona una interfaz moderna para el cálculo y la visualización de métodos numéricos aplicados, comenzando con el análisis de Series de Fourier.

---

## 🚀 Quick Start: Docker-First (Recommended)

Este proyecto está diseñado para ejecutarse **exclusivamente con Docker**. Se desaconseja la instalación manual de dependencias (Python, Node, Uvicorn, etc.) para evitar conflictos de versiones y asegurar que el entorno coincida con el de producción.

### 1. Requisito Principal: Instalar Docker
*   **En Windows (Recomendado)**: Instala [Docker Desktop](https://www.docker.com/products/docker-desktop/). Asegúrate de que esté corriendo antes de ejecutar los comandos.
*   **En Linux**: Instala `docker` y `docker-compose-plugin` usando tu gestor de paquetes.

### 2. Ejecutar el Proyecto
Desde la raíz del proyecto, abre una terminal y ejecuta:

```powershell
# Inicia todo el sistema (Frontend + Backend)
docker compose up --build
```

Una vez que termine, accede a:
*   **Frontend**: [http://localhost:8083](http://localhost:8083)
*   **Backend API**: [http://localhost:8003](http://localhost:8003)

---

## Módulo de Series de Fourier

El sistema cuenta actualmente con un motor de análisis robusto para funciones periódicas y definidas a trozos (piecewise functions).

### Capacidades Técnicas
*   **Cálculo Simbólico Exacto**: Obtención de los coeficientes $a_0, a_n, b_n$ mediante la integración analítica con la librería SymPy.
*   **Visualización Dinámica**: Generación de gráficos interactivos con Plotly.js que permiten analizar la convergencia de la serie en tiempo real.
*   **Análisis del Fenómeno de Gibbs**: Posibilidad de ajustar el número de armónicos para observar el comportamiento de la serie cerca de discontinuidades.
*   **Optimización por Simetría**: Identificación automática de paridad (funciones pares o impares) para simplificar el proceso de cálculo.
*   **Presentación Matemática**: Integración con KaTeX para mostrar las fórmulas resultantes con calidad de publicación.

---

## Guía de Uso del Módulo

Para realizar un análisis, el usuario debe proporcionar la definición de la función y su intervalo.

### Ejemplo de Definición de Función
El motor acepta expresiones matemáticas estándar. Para funciones definidas a trozos, se utiliza la siguiente estructura lógica:
*   **Función**: `x**2` en el intervalo `[-pi, pi]`
*   **Función a trozos**: `1` si `x > 0`, `-1` si `x < 0`

### Parámetros de Configuración
1.  **Intervalo (L)**: Definición del período de la función.
2.  **Número de Armónicos**: Cantidad de términos de la serie a sumar para la aproximación.
3.  **Tipo de Serie**: Opción de calcular la serie trigonométrica estándar o simplificada por simetría.

---

## Tecnologías y Arquitectura

El proyecto implementa una arquitectura de servicios desacoplados para asegurar la eficiencia en el procesamiento matemático y la fluidez de la interfaz.

### Backend (Procesamiento)
*   **FastAPI**: Framework de alto rendimiento para la gestión de peticiones.
*   **SymPy**: Biblioteca de computación simbólica para el cálculo exacto de integrales.
*   **NumPy**: Biblioteca para el manejo de arreglos numéricos y generación de puntos de muestreo.

### Frontend (Interfaz de Usuario)
*   **React y TypeScript**: Desarrollo de componentes reactivos con tipado estático.
*   **Tailwind CSS**: Sistema de diseño basado en utilidades para una interfaz limpia y responsiva.
*   **Plotly.js**: Motor de visualización de datos científicos.
*   **KaTeX**: Renderizado de expresiones matemáticas en el navegador.

---

## Instrucciones de Instalación y Despliegue

### Requisitos del Sistema
*   Docker y Docker Compose.
*   Hardware compatible (Optimizado para ARM64/Raspberry Pi).

### Despliegue con Docker
Para iniciar la plataforma completa en segundo plano:
```bash
docker-compose up -d --build
```

### Configuración de Puertos
| Servicio | Puerto Host | Puerto Interno |
| :--- | :--- | :--- |
| Frontend | 8083 | 80 |
| Backend | 8003 | 8000 |

### Gestión de Red y Dominio
El proyecto está configurado para operar mediante un túnel de Cloudflare en la dirección **anc.sixtor.site**. El tráfico se redirige según la ruta:
*   Ruta raíz (`/`): Acceso al cliente de React.
*   Prefijo API (`/api/`): Acceso a los servicios del backend.

---
**Universidad Tecnológica Nacional**
*Facultad Regional La Plata - Cátedra de Análisis Numérico*
