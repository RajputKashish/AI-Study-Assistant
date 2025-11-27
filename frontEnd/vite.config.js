import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure esbuild parses JSX in .js files during dependency scanning
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  // Ensure Vite transforms .js files with JSX during dev and build
  esbuild: {
    loader: 'jsx',
    include: /.*\.(js|jsx)$/, // apply to .js/.jsx in project
    exclude: [/node_modules/],
    jsx: 'automatic',
  },
})
