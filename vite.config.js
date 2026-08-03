import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base must be absolute: the per-archetype OG pages live two levels deep at
// /a/{CODE}/, and they load the same bundle as the root index.html.
// Deploying to a GitHub Pages project site? Set VITE_BASE=/repo-name/.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
