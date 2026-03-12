import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, './src/ui'),
      '@components': path.resolve(__dirname, './src/ui/components'),
      '@layouts': path.resolve(__dirname, './src/ui/layouts'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@icons': path.resolve(__dirname, './assets/icons'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@images': path.resolve(__dirname, './assets/images'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@api': path.resolve(__dirname, './src/api'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
    },
  },
})
