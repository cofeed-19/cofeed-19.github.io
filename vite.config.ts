import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4605,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
