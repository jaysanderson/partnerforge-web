import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const API = process.env.API_URL ?? 'http://localhost:4000';

// In production the console is served under /console by the API.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    strictPort: true,
    // Same-origin in dev — proxy API + SSE to the Fastify server.
    proxy: {
      '/trpc': { target: API, changeOrigin: true },
      '/ai': { target: API, changeOrigin: true },
      '/health': { target: API, changeOrigin: true },
    },
  },
});
