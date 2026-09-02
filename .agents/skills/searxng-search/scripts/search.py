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
