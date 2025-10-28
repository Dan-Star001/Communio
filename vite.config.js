import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), flowbiteReact()],
  server: {
    proxy: {
      '/api': {
        target: 'https://backend-e54z.onrender.com',
        changeOrigin: true
      },
      '/user': {
        target: 'https://backend-e54z.onrender.com',
        changeOrigin: true
      }
    }
  }
})
