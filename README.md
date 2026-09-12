# Proyecto ANC — Plataforma de Análisis Numérico y Métodos de Cálculo

<div align="center">

[![UTN FRLP](https://img.shields.io/badge/UTN%20FRLP-Analisis%20Numerico-00529B?style=for-the-badge&logo=googlescholar&logoColor=white)](https://www.frlp.utn.edu.ar/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

Plataforma web interactiva para cálculo simbólico, experimentación numérica, ajuste de datos y visualización interactiva de métodos matemáticos aplicados.

[Servidor Primario (anc.sixtor.com)](https://anc.sixtor.com) | [Espejo en la Nube (anc2.sixtor.com)](https://anc2.sixtor.com) | [Inicio Rápido](#inicio-rápido-docker-first) | [Módulos](#módulos-de-la-plataforma) | [Tecnologías](#tecnologías-y-herramientas) | [Integrantes](#integrantes)

</div>

---

## Descripción General

**Proyecto ANC** es una plataforma web interactiva y modular desarrollada como soporte académico de ingeniería para la cátedra de **Análisis Numérico** de la Universidad Tecnológica Nacional, Facultad Regional La Plata (UTN FRLP).

El sistema implementa una arquitectura desacoplada de alto rendimiento basada en microservicios contenerizados, combinando un motor matemático analítico/simbólico en backend (**FastAPI + SymPy + NumPy**) con una interfaz interactiva moderna **Mobile-First** optimizada para dispositivos táctiles y pantallas de escritorio (**React + TypeScript + Vite + Tailwind CSS + Plotly.js + KaTeX**).

---

## Módulos de la Plataforma

```
                                +---------------------------------------------+
                                |                PROYECTO ANC                 |
                                |             (Análisis Numérico)             |
                                +----------------------+----------------------+
                                                       |
        +----------------------------+-----------------+---------------------------+----------------------------+
        |                            |                                             |                            |
        v                            v                                             v                            v
+---------------+            +---------------+                             +---------------+            +---------------+
|   Series de   |            |  Análisis de  |                             |  Cálculo de   |            |   Regresión   |
|    Fourier    |            |   Armónicos   |                             |    Raíces     |            |  y Mín. Cuad. |
|  (/fourier)   |            |  (/harmonics) |                             |   (/roots)    |            | (/regression) |
+---------------+            +---------------+                             +---------------+            +---------------+
| • SymPy Exacto|            | • Mic / Audio |                             | • Newton-Raph.|            | • Caso 1 Real |
| • Trozos / PW |            | • FFT en vivo |                             | • Punto Fijo  |            | • Modelos Cát.|
| • Gibbs Dinám.|            | • Espectro f0 |                             | • Pasos LaTeX |            | • Pasos Gauss |
| • Paridad Sim.|            | • Plotly Inter|                             | • Reporte PDF |            | • Residuos/r² |
+---------------+            +---------------+                             +---------------+            +---------------+
```

### 1. Analizador de Series de Fourier (`/fourier`)
* **Cálculo Simbólico Exacto:** Integración analítica formal de coeficientes de Euler-Fourier ($a_0$, $a_n$, $b_n$) mediante SymPy con precisión matemática cerrada.
* **Funciones a Trozos (Piecewise):** Definición flexible de funciones periódicas continuas y discontinuas por tramos.
* **Fenómeno de Gibbs:** Visualización gráfica del comportamiento oscilatorio y sobrepicos característicos en saltos de discontinuidad ante la truncación armónica.
* **Optimización por Simetría:** Detección automática de paridad (funciones pares, impares o de simetría de media onda) para simplificación y anulación analítica de integrales.
* **Renderizado Matemático:** Expresiones algebraicas dinámicas renderizadas con KaTeX.

### 2. Análisis de Armónicos y FFT (`/harmonics`)
* **Transformada Rápida de Fourier (FFT):** Descomposición espectral en frecuencia de ondas de audio y señales continuas.
* **Fuente de Entrada Dual:** Ingesta directa de audio en tiempo real desde el micrófono del dispositivo o mediante carga de archivos `.wav`.
* **Identificación Espectral:** Determinación precisa de la frecuencia fundamental ($f_0$), armónicos superiores y visualización interactiva con Plotly.js.

### 3. Cálculo de Raíces de Ecuaciones No Lineales (`/roots`)
* **Métodos Iterativos Implementados:** Métodos numéricos de **Newton-Raphson** y **Punto Fijo** ($x_{n+1} = g(x_n)$).
* **Análisis de Convergencia:** Comparación simultánea de velocidad de convergencia, órdenes de aproximación, número de iteraciones y evolución del error relativo porcentual.
* **Visualización Gráfica Interactiva:**
  * *Método de Newton:* Trazado geométrico interactivo de rectas tangentes iteración a iteración sobre la curva $f(x)$.
  * *Método de Punto Fijo:* Representación dinámica de trayectorias (gráfico de telaraña) sobre la función generadora $y = g(x)$ y la recta identidad $y = x$.
* **Resolución Detallada y Exportación:** Desglose paso a paso con sustitución numérica formal de fórmulas en LaTeX y exportación de informes completos en PDF.

### 4. Regresión y Ajuste por Mínimos Cuadrados (`/regression`)
* **Estudio de Caso Real 1 (Enfriamiento de Bebidas):**
  * Análisis comparativo del comportamiento térmico de 4 tipos de recipientes: *Taza de cerámica*, *Vaso térmico*, *Vaso de polipapel* y *Lata de aluminio* sobre un total de 244 mediciones experimentales.
  * Modelado mediante regresión lineal, polinomios de 2° y 3° grado, y la formulación física de la **Ley de Enfriamiento de Newton** ($T(t) = T_{amb} + (T_0 - T_{amb}) e^{-k t}$).
  * Gráficos comparativos de dispersión, ajuste continuo y análisis detallado de residuos individuales ($e_i = y_i - y_{ajuste}$).
  * Ranking cuantitativo de aislamiento térmico según la constante de enfriamiento $k$ y 4 conclusiones pedagógicas fundamentadas.
* **Solucionador y Calculadora Multiparámetro:**
  * Soporte de modelos analíticos canónicos de cátedra:
    * **Lineal:** $y = a_1 + a_2 x$
    * **Polinómico:** $y = a_1 + a_2 x + a_3 x^2 + \dots + a_m x^{m-1}$ (grado configurable)
    * **Exponencial:** $y = a e^{b x}$ (linealizado mediante $\ln y$)
    * **Potencial:** $y = a x^b$ (linealizado mediante $\ln y, \ln x$)
    * **Ecuación del Cociente / Razón de Crecimiento:** $y = \frac{x}{a x + b}$ (linealizado mediante $1/y, 1/x$)
  * **Carga Rápida de Datos:** Entrada matricial y pegado masivo directo desde portapapeles o planillas de cálculo (Excel / CSV).
  * **Resolución Paso a Paso de Ecuaciones Normales:** Visualización explícita de sumatorias, armado de la matriz de coeficientes de Gauss, resolución del sistema y cálculo canónico de la dispersión total ($ST$), varianza residual no explicada ($SR$) y bondad de ajuste ($r^2$).
  * **Gráfico Interactivo de Alta Fidelidad:** Gráfico dinámico continuo (estilo GeoGebra) con controles táctiles de paneo horizontal/vertical, zoom bidireccional y evaluación matemática en tiempo real del modelo obtenido.
* **Resolución Completa de Trabajos Prácticos (TP N° 4):**
  * Guía oficial resuelta de manera interactiva con enunciados textuales, tablas de datos precargadas en un clic y resoluciones asistidas por software.

---

## Arquitectura y Despliegue en Alta Disponibilidad (Dual-Host)

El proyecto cuenta con una infraestructura híbrida diseñada para garantizar **100% de disponibilidad continua** ante eventuales cortes de energía o conectividad en el servidor local:

```text
                                [ ACCESO DEL USUARIO ]
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         ▼                                                                   ▼
[ SERVIDOR PRIMARIO LOCAL ]                                       [ FAILOVER EN LA NUBE ]
(https://anc.sixtor.com)                                          (https://anc2.sixtor.com)
         │                                                                   │
         ├── Cloudflare Tunnel (Edge Zero-Trust)                             ├── Cloudflare Pages (Frontend CDN Global)
         ├── Raspberry Pi 4 Model B (ARM64 64-bit)                           │    └── Worker Edge Proxy (_worker.js)
         ├── Nginx Alpine (Puerto 8083 -> Frontend React)                    │         └── Sin CORS / Encapsulado
         └── Uvicorn (Puerto 8003 -> Backend FastAPI)                        └── Render Free Web Service
                                                                                  └── Contenedor Docker FastAPI
```

| Entorno | Frontend | Backend | Enrutamiento / Dominio |
| :--- | :--- | :--- | :--- |
| **Primario (Local)** | Nginx Alpine en Docker | FastAPI / Python 3.11 en Docker | [anc.sixtor.com](https://anc.sixtor.com) (Cloudflare Tunnel) |
| **Respaldo (Nube)** | Cloudflare Pages (Anycast CDN) | Render Cloud Web Service (Docker) | [anc2.sixtor.com](https://anc2.sixtor.com) (Edge Proxy sin CORS) |

---

## Inicio Rápido: Docker-First

La plataforma está diseñada bajo un enfoque **Docker-First**, garantizando paridad exacta entre el desarrollo local y los entornos de producción.

### Requisitos Previos
* [Docker Engine](https://docs.docker.com/engine/install/) 24+ o [Docker Desktop](https://www.docker.com/products/docker-desktop/).
* [Docker Compose](https://docs.docker.com/compose/) v2+.

### 1. Entorno de Desarrollo Local (Con Hot-Reload instantáneo)
Para desarrollar y ver los cambios en vivo sin reconstruir imágenes de Docker (Vite HMR en frontend y Uvicorn `--reload` con volúmenes montados en backend):

```bash
# Clonar el repositorio
git clone https://github.com/62Javi/proyect-anc.git
cd proyect-anc

# Iniciar los servicios con Hot-Reload
docker compose up -d
```

### 2. Entorno de Producción Local (Raspberry Pi / Servidor)
Para compilar los paquetes estáticos optimizados con Nginx y dependencias de producción:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Puntos de Acceso Local
| Servicio | URL Local | Descripción |
| :--- | :--- | :--- |
| **Frontend Web** | `http://localhost:8083` | Interfaz interactiva de usuario (Vite / React) |
| **Backend API** | `http://localhost:8003` | API REST y documentación OpenAPI interactiva (`/docs`) |

---

## Tecnologías y Herramientas

| Componente | Stack Tecnológico |
| :--- | :--- |
| **Backend Core** | Python 3.11+, FastAPI, SymPy (Cálculo simbólico exacto), NumPy (Álgebra matricial y numérica), Uvicorn |
| **Frontend Core** | React 18, TypeScript 5+, Vite, React Router v6, Tailwind CSS |
| **Visualización & Matemáticas** | Plotly.js (Gráficos interactivos y espectros FFT), KaTeX (Tipografía matemática LaTeX de alto rendimiento), Lucide Icons |
| **Calidad & Testing** | Pytest, Vitest, Ruff Linter |
| **DevOps & Despliegue** | Docker, Docker Compose, Nginx Alpine, Cloudflare Pages, Cloudflare Tunnels, Render Cloud |

---

## Integrantes

| Integrante | Legajo |
| :--- | :--- |
| **Castro Cope Sixto Javier** | 32797 |
| **Figueroa Rodrigo Ivan** | 31839 |
| **Orellana Maximiliano Octavio** | 32803 |
| **Portillo Franco Javier** | 31089 |

---

## Información Académica

* **Institución:** Universidad Tecnológica Nacional, Facultad Regional La Plata (UTN FRLP)
* **Carrera:** Ingeniería en Sistemas de Información
* **Cátedra:** Análisis Numérico
* **Ciclo Lectivo:** 2026
