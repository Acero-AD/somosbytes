import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // relative base so the static build works when served from a bucket subpath
  base: './',
  plugins: [react()],
})
