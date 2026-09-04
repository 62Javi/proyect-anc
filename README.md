# Proyecto ANC — Plataforma de Analisis Numerico y Metodos de Calculo

<div align="center">

[![UTN FRLP](https://img.shields.io/badge/UTN%20FRLP-Analisis%20Numerico-00529B?style=for-the-badge&logo=googlescholar&logoColor=white)](https://www.frlp.utn.edu.ar/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

Plataforma web para calculo simbolico, experimentacion numerica y visualizacion interactiva de metodos matematicos aplicados.

[Demo en Vivo](https://anc.sixtor.com) | [Inicio Rapido](#inicio-rapido-docker-first) | [Modulos](#modulos-de-la-plataforma) | [Tecnologias](#tecnologias-y-herramientas) | [Integrantes](#integrantes)

</div>

---

## Descripcion General

Proyecto ANC es una plataforma web interactiva desarrollada como soporte academico para la catedra de Analisis Numerico de la Universidad Tecnologica Nacional, Facultad Regional La Plata (UTN FRLP).

El sistema implementa una arquitectura desacoplada basada en servicios, combinando un motor matematico de calculo simbolico y numerico en backend con una interfaz interactiva Mobile-First en frontend.

---

## Modulos de la Plataforma

```
                        +------------------------------+
                        |         PROYECTO ANC         |
                        |      (Analisis Numerico)     |
                        +--------------+---------------+
           +---------------------------+---------------------------+
           |                           |                           |
           v                           v                           v
+---------------------+     +---------------------+     +---------------------+
|  Series de Fourier  |     |Analisis de Armonicos|     |  Calculo de Raices  |
|  - Simbolico SymPy  |     |  - Transformada FFT |     |  - Newton-Raphson   |
|  - Fenomeno Gibbs   |     |    (Microfono / WAV)│     |  - Punto Fijo g(x)  |
|  - Simetria y Trozos|     |  - Espectrograma    |     |  - Graficos y Pasos |
+---------------------+     +---------------------+     +---------------------+
```

### 1. Analizador de Series de Fourier (`/fourier`)
* Calculo Simbolico Exacto: Integracion analitica de coeficientes de Euler-Fourier ($a_0, a_n, b_n$) mediante SymPy.
* Funciones a Trozos (Piecewise): Definicion de funciones periodicas continuas y discontinuas por tramos.
* Fenomeno de Gibbs: Visualizacion dinamica del comportamiento oscilatorio y sobrepicos en discontinuidades de salto al truncar la serie.
* Optimizacion por Simetria: Identificacion automatica de paridad (funciones pares e impares) para simplificacion de integrales.
* Renderizado Matematico: Expresiones algebraicas formateadas con KaTeX.

### 2. Analisis de Armonicos y FFT (`/harmonics`)
* Transformada Rapida de Fourier (FFT): Descomposicion espectral de senales de audio en tiempo real.
* Fuente de Senal Dual: Ingesta de audio directamente desde microfono o carga de archivos locales `.wav`.
* Deteccion Espectral: Identificacion de la frecuencia fundamental ($f_0$) y visualizacion interactiva de armonicos mediante Plotly.js.

### 3. Calculo de Raices de Ecuaciones No Lineales (`/roots`)
* Metodos Implementados: Metodos iterativos de Newton-Raphson y Punto Fijo ($x_{n+1} = g(x_n)$).
* Comparacion de Metodos: Analisis simultaneo de convergencia, numero de iteraciones y evolucion del error relativo entre ambos metodos.
* Visualizacion Grafica Interactiva:
  * Metodo de Newton: Trazado geometrico interactivo de rectas tangentes iteracion a iteracion.
  * Metodo de Punto Fijo: Representacion grafica de iteraciones sucesivas mediante la funcion generadora $y = g(x)$ y la recta identidad $y = x$.
* Resolucion Detallada: Desglose paso a paso con sustitucion de formulas en LaTeX y exportacion de reportes en PDF.

---

## Inicio Rapido: Docker-First

El proyecto esta configurado para ejecutarse mediante Docker, garantizando paridad entre los entornos de desarrollo y produccion.

### Requisitos
* Docker Engine 24+ o Docker Desktop.
* Docker Compose v2+.

### Ejecucion

```bash
# Clonar el repositorio
git clone https://github.com/62Javi/proyect-anc.git
cd proyect-anc

# Iniciar los servicios (Frontend + Backend)
docker compose up --build
```

### Puntos de Acceso Local
| Servicio | Direccion | Descripcion |
| :--- | :--- | :--- |
| Frontend Web | http://localhost:8083 | Interfaz de usuario interactiva (React + Vite) |
| Backend API | http://localhost:8003 | Documentacion Swagger interactiva en `/docs` |

---

## Tecnologias y Herramientas

| Componente | Stack Tecnologico |
| :--- | :--- |
| Backend | Python 3.11+, FastAPI, SymPy, NumPy, Uvicorn |
| Frontend | React 18, TypeScript 5+, Vite, Tailwind CSS, Plotly.js, KaTeX, Lucide |
| Pruebas y Calidad | Pytest, Vitest, Ruff |
| Despliegue e Infraestructura | Docker Compose, Nginx Alpine, Cloudflare Tunnel, ARM64 |

---

## Despliegue en Produccion

La aplicacion se encuentra operativa en servidor dedicado:

* Hardware: Raspberry Pi 4 Model B (ARM64)
* Mapeo de Puertos:
  * Puerto 8083: Servicio web Frontend (Nginx)
  * Puerto 8003: Servicio REST Backend (FastAPI)
* Enrutamiento y SSL: Cloudflare Tunnel conectado al dominio [anc.sixtor.com](https://anc.sixtor.com).

---

## Integrantes

| Integrante | Legajo |
| :--- | :--- |
| Castro Cope Sixto Javier | 32797 |
| Figueroa Rodrigo Ivan | 31839 |
| Orellana Maximiliano Octavio | 32803 |
| Portillo Franco Javier | 31089 |

---

## Informacion Academica

* Institucion: Universidad Tecnologica Nacional, Facultad Regional La Plata (UTN FRLP)
* Catedra: Analisis Numerico
* Ciclo Lectivo: 2026
