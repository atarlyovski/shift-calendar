import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const padTo2 = num => {
  return num < 10 ? '0' + num : num;
}

const now = new Date();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(now.getFullYear() + "-" + padTo2(now.getMonth() + 1) + "-" + padTo2(now.getDate()))
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
