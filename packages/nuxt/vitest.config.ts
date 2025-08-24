import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['test/**/*.test.ts'],
    exclude: ['node_modules', '.nuxt']
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './'),
      '#shared': resolve(__dirname, '../../firebase/functions/src/types/shared')
    }
  }
})