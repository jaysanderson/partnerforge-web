import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const API = process.env.API_URL ?? 'http://localhost:4000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/trpc': { target: API, changeOrigin: true },
      '/portal': { target: API, changeOrigin: true },
      '/health': { target: API, changeOrigin: true },
    },
  },
});
