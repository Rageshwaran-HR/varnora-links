import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist', // output folder for build
    emptyOutDir: true,  // clean dist folder before build
  },
})
