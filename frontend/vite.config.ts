import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Tests only cover plain functions in src/utils, so no browser environment is needed.
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
