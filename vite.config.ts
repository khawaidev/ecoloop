

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,          // allows external access
    allowedHosts: true   // allows all tunnel domains (Serveo, localhost.run, etc.)
  }
})