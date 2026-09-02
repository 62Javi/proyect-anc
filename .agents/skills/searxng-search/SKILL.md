---
name: searxng-search
description: |
  Private and token-efficient web search via local or remote SearXNG instance. Use this skill when searching for current technical documentation, libraries, frameworks, news, AI benchmarks, or when looking to avoid training cutoff bias without commercial API costs.
allowed-tools: Bash(python3 *)
---

# SearXNG Search

Búsqueda web privada, rápida y ultra-optimizada en consumo de tokens.

## Uso del Script

Ruta: `scripts/search.py`

```bash
# Búsqueda compacta (Título | URL | Fecha) - Ahorro de 90% de tokens
python3 scripts/search.py "tu consulta" -c

# Búsqueda filtrada para el año actual (Librerías, frameworks)
python3 scripts/search.py "fastapi tutorial" -c -f

# Búsqueda filtrada para el mes actual (Modelos de IA, benchmarks)
python3 scripts/search.py "latest claude 3.7 benchmarks" -c -l

# Top N resultados (por defecto 5)
python3 scripts/search.py "numpy 2.0 migration" -c -n 3
```

## Opciones

| Flag | Descripción |
|---|---|
| `-c`, `--compact` | Devuelve solo título, URL y fecha |
| `-n`, `--top` | Cantidad de resultados deseados (default: 5) |
| `-f`, `--fresh` | Agrega el año actual y filtra resultados de los últimos 12 meses |
| `-l`, `--latest` | Agrega mes y año actual y filtra solo las últimas semanas |
