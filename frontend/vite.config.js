import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/openrouter': {
        target: 'https://openrouter.ai',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/openrouter/, '/api/frontend'),
        headers: {
          'Origin': 'https://openrouter.ai',
          'Referer': 'https://openrouter.ai/',
          'User-Agent': 'Mozilla/5.0',
          'Content-Type': 'application/json',
        },
      },
    },
  },


})
