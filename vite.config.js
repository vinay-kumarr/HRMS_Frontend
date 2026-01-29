import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'rice-mazda-governor-vegetation.trycloudflare.com',
      '.trycloudflare.com' // Allow any cloudflare tunnel for convenience
    ]
  }
})
