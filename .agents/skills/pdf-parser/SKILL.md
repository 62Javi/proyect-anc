---
name: pdf-parser
description: |
  Convert PDF, Word (.docx), Excel (.xlsx), and PowerPoint documents into clean Markdown with caching support using Microsoft MarkItDown. Use this skill whenever reading, extracting, or analyzing technical PDFs, textbooks, or mathematical documents.
allowed-tools: Bash(python3 *)
---

# PDF Parser (MarkItDown)

Conversor inteligente de documentos y PDFs a Markdown con caché MD5.

## Uso del Script

Ruta: `scripts/parse.py`

```bash
# Convertir un archivo PDF o documento a Markdown
python3 scripts/parse.py "/ruta/al/documento.pdf"
```

El archivo Markdown generado se guardará en `~/.cache/pdf-parser/` para su posterior lectura rápida.
