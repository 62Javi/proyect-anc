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
