import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make VITE_READONLY available at build time
    'import.meta.env.VITE_READONLY': JSON.stringify(process.env.VITE_READONLY || 'false'),
  },
  build: {
    // Ensure environment variables are available at build time
    rollupOptions: {
      external: [],
    },
  },
})
