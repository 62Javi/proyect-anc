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
