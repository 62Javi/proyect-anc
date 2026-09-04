# 🛠️ Skills de `proyect-anc` y Entorno Antigravity

Este documento detalla todas las **skills** disponibles en este proyecto (`proyect-anc`), su propósito, cuándo utilizarlas y la jerarquía entre herramientas locales y globales.

---

## 🎯 Skills Específicas del Proyecto (`.agents/skills/`)

Estas skills están configuradas directamente en el repositorio para el desarrollo de la plataforma:

### 🎨 UI/UX Pro Max
- **Ubicación:** [`.agents/skills/ui-ux-pro-max/SKILL.md`](file:///home/sixto/projects/proyect-anc/.agents/skills/ui-ux-pro-max/SKILL.md)
- **¿Qué es?:** Sistema integral de inteligencia de diseño para interfaces web y móviles. Incluye más de 50 estilos visuales, 161 paletas de color, 57 combinaciones tipográficas, 99 directrices UX y 25 tipos de gráficos.
- **Uso en `proyect-anc` (Mandatorio según `AGENTS.md`):**
  - **Phone-First / Mobile-First:** Todas las interfaces matemáticas (Fourier, cálculo numérico) deben estar optimizadas primero para pantallas táctiles de teléfonos antes de escalar a desktop.
  - Selección de contraste accesible (mínimo 4.5:1), tamaños de interacción táctil (mínimo 44×44px).
  - Componentes React, Tailwind CSS, KaTeX y gráficos interactivos con Plotly.js.
- **Cuándo se activa:** Creación o refactorización de páginas/componentes, elección de temas de color, diseño de dashboards o controles interactivos.

---

## 🌐 Skills Globales del Entorno de Sixto (`~/.gemini/skills/`)

De acuerdo con las **Reglas Globales (`~/.gemini/GEMINI.md`)**, también dispones de utilidades clave a nivel de sistema:

| Skill | Ubicación | Propósito y Protocolo |
| :--- | :--- | :--- |
| **SearXNG Search** | `~/.gemini/skills/searxng-search` | **Paso 1 Obligatorio de búsqueda:** Instancia privada en Raspberry Pi 4 (`192.168.1.100:8085`). Ejecutar `python3 /home/sixto/.gemini/skills/searxng-search/scripts/search.py "consulta" -c`. |
| **Jina Reader** | `~/.gemini/skills/jina-reader` | **Paso 2 Obligatorio de lectura:** Scraping token-efficient a Markdown de cualquier URL externa. `python3 /home/sixto/.gemini/skills/jina-reader/scripts/read.py "https://url.com"`. |
| **PDF Parser** | `~/.gemini/skills/pdf-parser` | Extracción de texto y análisis estructurado de libros o papers en formato PDF. |
| **Remotion** | `~/.gemini/skills/remotion` | Generación de animaciones y videos programáticos con React. |
| **Spec Kit** | `~/.gemini/skills/spec-kit` | Herramientas para desarrollo guiado por especificaciones (Spec-driven development). |

---

## ⚙️ Built-in Skills (Antigravity CLI)

- **`antigravity-guide`:** Manual operativo de referencia rápida para el CLI de Antigravity (comandos slash, keybindings, sidecars, etc.).
- **`agy-customizations`:** Guía para definir y extender skills, reglas, plugins y servidores MCP.

---

## 🧪 Herramienta Complementaria: Universal Verify

Mencionada en [`AGENTS.md`](file:///home/sixto/projects/proyect-anc/AGENTS.md):
- **Comando:** `verify`
- **Función:** Auto-validación de código multiplataforma (Python, Rust, Node.js) para detectar y corregir errores de tipado, tests y linters antes de realizar commits o entregas.
