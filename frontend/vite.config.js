import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Absolute asset URLs so Cloudflare Pages serves /assets/*.js with correct MIME,
  // not relative paths that break under SPA client routes.
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
})
