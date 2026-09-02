---
name: jina-reader
description: |
  Token-efficient web page reader that converts any URL to clean Markdown without HTML boilerplate, scripts, ads, or styles. Use this skill when extracting articles, documentation, API specs, or web pages with high signal-to-noise ratio.
allowed-tools: Bash(python3 *)
---

# Jina Reader

Lector web token-efficient que convierte cualquier URL directamente a Markdown limpio.

## Uso del Script

Ruta: `scripts/read.py`

```bash
# Leer URL estándar
python3 scripts/read.py "https://docs.python.org/3/library/ast.html"

# Limitar tamaño máximo de caracteres (por defecto 15000)
python3 scripts/read.py "https://example.com/large-article" -m 8000
```
