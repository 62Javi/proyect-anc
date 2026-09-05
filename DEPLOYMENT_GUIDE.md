# Guía de Despliegue y Producción - Proyect ANC

Este documento detalla las restricciones y la configuración necesaria para que el proyecto funcione correctamente en la Raspberry Pi (Entorno de Producción).

## ⚠️ El error de la "Pantalla en Blanco"
Si el proyecto funciona en `localhost` pero muestra una pantalla en blanco en `anc.sixtor.com`, se debe generalmente a que se está intentando usar el servidor de desarrollo en lugar del de producción.

### ¿Por qué ocurre?
1. **Vite Dev Server vs Túneles**: Vite en desarrollo sirve archivos como módulos ESM. Cloudflare y los túneles tienen dificultades para manejar cientos de peticiones de módulos simultáneas, lo que causa errores de carga.
2. **Restricción de `allowedHosts`**: Vite bloquea peticiones de dominios desconocidos por seguridad.
3. **Conflictos de `node_modules`**: Nunca se deben compartir carpetas `node_modules` entre Windows/Mac y la Raspberry Pi (ARM) mediante volúmenes de Docker, ya que las dependencias nativas fallarán.

---

## 🚀 Configuración de Producción (Mandatoria para Pi)

### 1. Frontend (Nginx)
En la Raspberry Pi, el frontend **DEBE** ser compilado y servido por Nginx.
- **Archivo**: `frontend/Dockerfile` (Usa una etapa de `build` y luego `nginx:stable-alpine`).
- **Puerto**: El contenedor interno usa el `80`, mapeado al **8083** externo.
- **Docker Compose**:
  ```yaml
  frontend:
    build: ./frontend
    ports:
      - "8083:80"
  ```

### 2. Backend (FastAPI)
- **Puerto**: Interno `8000`, mapeado al **8003** externo.
- **CORS**: El backend debe permitir explícitamente el origen `https://anc.sixtor.com`.

### 3. Puertos Críticos
Para mantener la compatibilidad con el túnel de Cloudflare, **NO CAMBIAR** los puertos externos:
- **Frontend**: 8083
- **Backend**: 8003

---

## 🛠️ Flujo de Actualización en la Raspberry Pi (Entorno Principal)
Para actualizar el servidor en la Raspberry Pi tras cambios en Git:

```bash
cd ~/proyectos/proyect-anc
git pull origin testeosjavi   # o main
docker compose up -d --build
```
El flag `--build` es vital para que Vite re-compile los archivos estáticos de producción y Nginx los sirva actualizados.

---

## ☁️ Entorno de Respaldo en la Nube: High-Availability Failover (`anc2.sixtor.com`)

Para garantizar disponibilidad ante cortes de energía o conectividad en el hogar (donde reside la Raspberry Pi), existe una réplica 100% gratuita y desacoplada en la nube.

```text
Usuario -> https://anc2.sixtor.com
             │
             ├──> Frontend (Vite / React)
             │    └── Cloudflare Pages (Global Anycast CDN, 0 ms cold start, 100% uptime)
             │
             └──> Peticiones API (/api/*)
                  └── Cloudflare Edge Worker (frontend/public/_worker.js)
                       └── Proxy inverso transparente a Render Backend:
                           https://proyect-anc.onrender.com
```

### 1. Backend en la Nube (Render Free Tier)
* **URL:** `https://proyect-anc.onrender.com`
* **Configuración:** `render.yaml` (Blueprint en la raíz del proyecto).
  * **Root Directory:** `backend`
  * **Runtime:** Docker (`backend/Dockerfile` expone `${PORT:-8000}`).
* **Actualización:** **100% Automática**. Cada `git push` a GitHub desencadena la recompilación y despliegue del contenedor sin intervención manual.
* **Comportamiento Free Tier:** Tras 15 minutos sin tráfico entra en suspensión (*spin down*). La primera petición tarda ~40 segundos en reactivarse; las siguientes responden instantáneamente.

### 2. Frontend en la Nube (Cloudflare Pages)
* **Proyecto:** `proyect-anc` (`proyect-anc.pages.dev`).
* **Dominio personalizado:** `anc2.sixtor.com` (con certificado SSL gestionado automáticamente por Cloudflare).
* **Proxy de API sin CORS (`_worker.js`):**
  El archivo `frontend/public/_worker.js` actúa como Worker en el Edge. Intercepta cualquier llamada a `/api/*` y la reenvía a `https://proyect-anc.onrender.com` preservando cabeceras y métodos (GET, POST, OPTIONS) sin restricciones de CORS en el navegador.

### 3. Cómo actualizar el Frontend en Cloudflare Pages desde cualquier máquina
Si modificaste componentes o estilos en `frontend/` y quieres actualizar `anc2.sixtor.com`:

```bash
# 1. Compilar el frontend localmente
cd frontend
npm install --legacy-peer-deps
npm run build

# 2. Desplegar la carpeta 'dist' a Cloudflare Pages con Wrangler
CLOUDFLARE_API_TOKEN="<TU_TOKEN_DE_CLOUDFLARE>" \
CLOUDFLARE_ACCOUNT_ID="6711e5311eb27fc17c92b5b7298898b8" \
npx wrangler pages deploy dist --project-name=proyect-anc --branch=testeosjavi
```

*(Nota: el token de Cloudflare para Pages requiere permisos de `Account: Cloudflare Pages: Edit` y `Zone: DNS: Edit`).*

