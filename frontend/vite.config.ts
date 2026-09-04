import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 80,
    allowedHosts: ['anc.sixtor.com', 'anc.sixtor.site', 'localhost', '127.0.0.1'],
    hmr: {
      clientPort: 8083,
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
    },
  },
})
