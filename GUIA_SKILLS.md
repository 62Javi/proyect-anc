# 🚀 Guía Maestra de Skills para tu Agente de IA

Esta guía está diseñada para que puedas replicar y entender exactamente la arquitectura de **Skills** que utilizamos, por qué existen, cómo funcionan bajo el capó y cómo configurarlas en tu propio entorno de desarrollo (compatible con **Antigravity CLI**, **Claude Code**, **Cursor**, o cualquier agente basado en LLM).

---

## 💡 1. ¿Qué es una Skill y cómo funciona la Arquitectura?

En un agente de código, una **Skill** no es más que una carpeta modular con instrucciones y scripts que le otorgan "superpoderes" o capacidades especializadas al modelo.

### Estructura Estándar de una Skill
```text
mi-skill/
├── SKILL.md         # Archivo obligatorio: Frontmatter YAML + Instrucciones para el LLM
└── scripts/          # (Opcional) Scripts ejecutables (Python, Bash, Node) que el agente puede correr
    └── run.py
```

### El archivo `SKILL.md`
Todo archivo `SKILL.md` debe comenzar con un encabezado YAML:
```yaml
---
name: nombre-de-la-skill
description: Explicación clara de qué hace y cuándo el agente DEBE activarla automáticamente.
---

# Instrucciones detalladas para el modelo...
```
El agente lee la descripción al inicio de cada sesión y decide autónomamente cuándo consultar el archivo completo o ejecutar sus scripts.

---

## 🎨 2. UI/UX Pro Max (Diseño y Frontend)

### ¿Qué es y de dónde sale?
Esta skill es de código abierto y fue creada por la comunidad para convertir a los LLMs en diseñadores UI/UX de nivel senior.
- **Repositorio oficial de descarga:** [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- **Instalación:** Simplemente clonas o descargas la carpeta en tu directorio de skills:
  ```bash
  # En la carpeta local de tu proyecto:
  git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git .agents/skills/ui-ux-pro-max
  
  # O a nivel global para todos tus proyectos:
  git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git ~/.gemini/skills/ui-ux-pro-max
  ```

### ¿Por qué se usa?
Evita que el agente cree interfaces genéricas con botones azules planos o colores sin contraste.
- Contiene **50+ estilos de diseño** (Minimalismo, Bento Grid, Neumorfismo, Glassmorphism, Brutalismo).
- **161 paletas de colores armónicas** y 57 combinaciones tipográficas profesionales.
- Reglas estrictas de **accesibilidad WCAG** (contraste mínimo de 4.5:1, tamaño de botones de al menos 44×44px para dedos en pantallas táctiles).
- **Filosofía Phone-First / Mobile-First:** Obliga al agente a diseñar primero pensando en la pantalla pequeña de un teléfono con interacción táctil, antes de escalar a monitores de escritorio.

---

## 🔍 3. SearXNG Search (Búsqueda Web Privada y Anti-Cutoff)

### El Problema que Resuelve
1. **Sesgo de Corte de Entrenamiento (Training Cutoff):** Los modelos de lenguaje creen que la última versión de una librería o modelo de IA es la que existía cuando los entrenaron. Si les pides "la mejor librería para X", suelen recomendar librerías obsoletas o sintaxis deprecada.
2. **Desperdicio de Tokens:** Los motores de búsqueda normales devuelven páginas enteras o fragmentos gigantescos llenos de basura que queman miles de tokens innecesarios.
3. **Privacidad y Costos:** No pagas suscripciones a APIs de búsqueda comercial (Tavily, Google Custom Search, etc.).

### La Infraestructura: SearXNG
[SearXNG](https://github.com/searxng/searxng) es un metabuscador de código abierto que consulta Google, Bing, DuckDuckGo, Wikipedia, etc., agrega los resultados y los entrega sin rastreo ni publicidad.

**Cómo levantarlo en Docker:**
```bash
docker run -d \
  --name searxng \
  -p 8085:8080 \
  -v $(pwd)/searxng:/etc/searxng \
  -e "SEARXNG_BASE_URL=http://localhost:8085/" \
  searxng/searxng:latest
```
*(Asegúrate de que en `settings.yml` la opción `formats: [html, json]` tenga `json` habilitado).*

### El Script Inteligente (`scripts/search.py`)
El script que usa el agente tiene 3 claves:
1. **Modo Compacto (`-c`):** Solo devuelve `Título | URL | Fecha`. Esto reduce el consumo de tokens en un 90%.
2. **Flag `--fresh` (`-f`):** Para temas de programación general, añade el año actual a la búsqueda y filtra resultados de los últimos 12 meses.
3. **Flag `--latest` (`-l`):** Para temas ultra-volátiles (nuevos modelos de IA, benchmarks, precios de APIs), añade mes y año actual y filtra solo las últimas semanas.

#### Código base de `search.py` para tu agente:
```python
#!/usr/bin/env python3
import sys, json, re, argparse, urllib.request, urllib.parse
from datetime import datetime

# Cambia esto por la IP:Puerto donde corre tu SearXNG (o http://localhost:8085)
SEARXNG_URL = "http://localhost:8085"

def main():
    parser = argparse.ArgumentParser(description="Búsqueda eficiente con SearXNG")
    parser.add_argument("query", help="Texto de búsqueda")
    parser.add_argument("-c", "--compact", action="store_true", help="Solo Título, URL y Fecha")
    parser.add_argument("-n", "--top", type=int, default=5, help="Cantidad de resultados")
    parser.add_argument("-f", "--fresh", action="store_true", help="Resultados del año actual")
    parser.add_argument("-l", "--latest", action="store_true", help="Resultados del mes actual (temas de IA)")
    args = parser.parse_args()

    query = args.query
    now = datetime.now()
    params = {"q": query, "format": "json"}

    if args.latest:
        params["q"] += f" {now.strftime('%B %Y')}"
        params["time_range"] = "month"
    elif args.fresh:
        params["q"] += f" {now.year}"
        params["time_range"] = "year"

    url = f"{SEARXNG_URL}/search?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": "AgentSearch/1.0"})
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            results = data.get("results", [])[:args.top]
            
            for r in results:
                title = r.get("title", "Sin título")
                link = r.get("url", "")
                date = r.get("publishedDate", "")[:10]
                if args.compact:
                    print(f"- [{title}]({link}) {f'({date})' if date else ''}")
                else:
                    snippet = r.get("content", "")[:150]
                    print(f"### {title}\n{link}\n{snippet}\n")
    except Exception as e:
        print(f"Error al conectar con SearXNG: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
```

---

## 📖 4. Jina Reader (Lectura Web Token-Efficient a Markdown)

### El Problema que Resuelve
Cuando un agente abre un enlace tradicional (usando `curl` o descargando HTML):
- Descarga etiquetas `<script>`, hojas de estilo `<style>`, anuncios, menús de navegación y cookies.
- Una sola página puede costarle al agente **30,000 a 70,000 tokens**, llenando la memoria y gastando dinero.

### La Solución: Jina Reader
Jina Reader convierte cualquier sitio web en **Markdown estructurado puro**: conserva los encabezados, las tablas, los bloques de código y el texto principal, descartando toda la basura.

### Cómo Usarlo
Hay dos modalidades:

#### Opción A (Sin instalar nada, directo en la nube gratuita):
Jina ofrece un proxy público gratuito. Solo hay que anteponer `https://r.jina.ai/` a cualquier URL:
```bash
curl https://r.jina.ai/https://docs.python.org/3/library/ast.html
```

#### Opción B (Docker Local para máxima velocidad y privacidad):
```bash
docker run -d -p 3001:3000 jinaai/reader:latest
```

#### El Script `scripts/read.py` para tu Agente:
```python
#!/usr/bin/env python3
import sys, urllib.request, argparse

# Opción local: "http://localhost:3001"
# Opción nube gratuita: "https://r.jina.ai"
READER_BASE = "https://r.jina.ai"

def main():
    parser = argparse.ArgumentParser(description="Lector web a Markdown token-efficient")
    parser.add_argument("url", help="URL a leer")
    parser.add_argument("-m", "--max-chars", type=int, default=15000, help="Límite de caracteres")
    args = parser.parse_args()

    target = args.url if args.url.startswith("http") else f"https://{args.url}"
    req_url = f"{READER_BASE}/{target}" if "r.jina.ai" in READER_BASE else f"{READER_BASE}/{target}"

    req = urllib.request.Request(req_url, headers={"Accept": "text/plain"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            content = resp.read().decode("utf-8")
            if len(content) > args.max_chars:
                content = content[:args.max_chars] + "\n\n...[Contenido truncado para ahorrar tokens]..."
            print(content)
    except Exception as e:
        print(f"Error al leer URL con Jina: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
```

### 🔄 El Flujo de Trabajo Dorado (Búsqueda en 2 Pasos)
1. **Paso 1 (Descubrimiento):** El agente corre `search.py -c "pregunta"`. Obtiene 3 a 5 URLs compactas gastando apenas ~100 tokens.
2. **Paso 2 (Lectura profunda):** El agente selecciona la URL más relevante y corre `read.py "https://..."`. Recibe solo el contenido esencial en Markdown.

---

## 📄 5. PDF Parser (Conversor de PDFs a Markdown)

### El Problema que Resuelve
Analizar libros de texto (por ejemplo, cálculo, métodos numéricos), papers científicos o manuales en formato `.pdf` es pesado y propenso a errores de formato cuando se alimenta en binario al LLM.

### La Solución: Microsoft MarkItDown
Usamos la librería oficial de Microsoft llamada `markitdown`.
- **Instalación en tu entorno:**
  ```bash
  pip install markitdown
  ```
- Soporta PDFs, archivos Word (.docx), Excel (.xlsx), PowerPoint y los convierte a Markdown limpio preservando tablas y fórmulas.

### El Script `scripts/parse.py` con Sistema de Caché
El script calcula un hash MD5 del archivo PDF. Si ya fue procesado antes, no pierde tiempo volviendo a convertirlo:
```python
#!/usr/bin/env python3
import sys, hashlib
from pathlib import Path

try:
    from markitdown import MarkItDown
except ImportError:
    print("Error: Instala la librería con 'pip install markitdown'", file=sys.stderr)
    sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print("Uso: python3 parse.py <ruta_al_archivo.pdf>")
        sys.exit(1)

    pdf_path = Path(sys.argv[1]).resolve()
    if not pdf_path.exists():
        print(f"Archivo no encontrado: {pdf_path}")
        sys.exit(1)

    # Hash para caché
    hasher = hashlib.md5()
    with open(pdf_path, 'rb') as f:
        hasher.update(f.read())
    file_hash = hasher.hexdigest()[:8]

    # Carpeta de caché donde se guarda el markdown
    cache_dir = Path.home() / ".cache" / "pdf-parser"
    cache_dir.mkdir(parents=True, exist_ok=True)
    out_file = cache_dir / f"{pdf_path.stem}_{file_hash}.md"

    if not out_file.exists():
        md = MarkItDown()
        res = md.convert(str(pdf_path))
        with open(out_file, "w", encoding="utf-8") as f:
            f.write(res.text_content)
        print(f"✅ Convertido exitosamente a: {out_file}")
    else:
        print(f"⚡ Encontrado en caché: {out_file}")

    print(f"Para el agente: Lee directamente el archivo generado con tu herramienta de lectura de archivos.")

if __name__ == "__main__":
    main()
```

---

## 📋 6. Cómo Conectar Todo en el Archivo de Reglas de tu Agente

Para que tu agente use automáticamente estas herramientas sin que tengas que recordárselo cada vez, debes agregarlas a su archivo de instrucciones de cabecera (`AGENTS.md`, `GEMINI.md` o `CLAUDE.md`).

Aquí tienes un extracto listo para copiar:

```markdown
## 🛠️ Protocolo Obligatorio de Búsqueda y Lectura Web
- **Prohibido:** No uses motores de búsqueda estándar ni descargues HTML crudo directamente.
- **Paso 1 (Descubrimiento):** Ejecuta siempre el script de búsqueda compacta:
  `python3 /ruta/a/skills/searxng-search/scripts/search.py "consulta" -c`
  - Usa `-f` para librerías o frameworks actuales.
  - Usa `-l` obligatoriamente para modelos de IA o benchmarks.
- **Paso 2 (Lectura):** Si necesitas leer el contenido de una URL descubierta, usa el lector en Markdown:
  `python3 /ruta/a/skills/jina-reader/scripts/read.py "https://url.com"`

## 📄 Manejo de PDFs y Documentos
- Al recibir un PDF o documento técnico, conviértelo a Markdown antes de analizarlo:
  `python3 /ruta/a/skills/pdf-parser/scripts/parse.py "/ruta/al/documento.pdf"`
  Luego lee el archivo `.md` generado en la carpeta de caché.

## 🎨 Directrices de UI/UX
- Para cualquier cambio en componentes, diseño, colores o interfaz, consulta obligatoriamente la skill `ui-ux-pro-max`.
- Prioriza siempre el diseño "Phone-First": la interfaz debe funcionar de manera óptima en pantallas móviles táctiles antes de adaptarse a escritorio.
```

---
*Fin de la guía. Una vez compartida esta información con tu amigo, puedes borrar este archivo de tu proyecto sin afectar nada.*
