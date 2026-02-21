import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'rss-parser': 'rss-parser/dist/rss-parser.min.js',
    },
  },
  server: {
    port: 4065,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
