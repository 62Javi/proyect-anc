# Guía de Despliegue y Producción - Proyect ANC

Este documento detalla las restricciones y la configuración necesaria para que el proyecto funcione correctamente en la Raspberry Pi (Entorno de Producción).

## ⚠️ El error de la "Pantalla en Blanco"
Si el proyecto funciona en `localhost` pero muestra una pantalla en blanco en `anc.sixtor.site`, se debe generalmente a que se está intentando usar el servidor de desarrollo en lugar del de producción.

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
- **CORS**: El backend debe permitir explícitamente el origen `https://anc.sixtor.site`.

### 3. Puertos Críticos
Para mantener la compatibilidad con el túnel de Cloudflare, **NO CAMBIAR** los puertos externos:
- **Frontend**: 8083
- **Backend**: 8003

---

## 🛠️ Flujo de Actualización en la Raspberry Pi
Para actualizar el servidor, usa siempre estos comandos en orden:

```bash
cd ~/proyectos/proyect-anc
git pull origin main
docker compose up -d --build
```
El flag `--build` es vital para que Vite re-compile los archivos estáticos de producción y Nginx los sirva actualizados.
