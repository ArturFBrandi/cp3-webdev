import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // `npm run analyze` writes an interactive bundle map to dist/stats.html.
    process.env.ANALYZE ? visualizer({ filename: 'dist/stats.html', gzipSize: true }) : null,
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    css: { modules: { classNameStrategy: 'non-scoped' } },
    // Fewer parallel workers keeps start-up reliable on slow (e.g. WSL-mounted) disks.
    maxWorkers: 4,
    projects: [
      {
        extends: true,
        test: {
          name: 'web',
          environment: 'jsdom',
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
        },
      },
      {
        extends: true,
        test: {
          name: 'api',
          environment: 'node',
          include: ['api/**/*.test.ts'],
        },
      },
    ],
  },
})
