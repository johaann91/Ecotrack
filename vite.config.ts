import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: '/ecotrack/' is required for GitHub Pages project sites
// (served at https://johaann91.github.io/ecotrack/, not at domain root)
export default defineConfig({
  plugins: [react()],
  base: '/ecotrack/',
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
