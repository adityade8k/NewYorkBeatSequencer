// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
      '@styles': '/src/styles',
      '@utils': '/src/utils',
      '@lib': '/src/lib',
      '@components': '/src/components',
      '@pages': '/src/pages',
    },
  },
})
