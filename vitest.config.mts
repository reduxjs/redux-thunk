import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['./test/test.ts'],
    alias: {
      'redux-thunk': './src/index.ts', // @remap-prod-remove-line

      // this mapping is disabled as we want `dist` imports in the tests only to be used for "type-only" imports which don't play a role for jest
      '@internal/': './src/'
    },
    deps: {
      interopDefault: true
    }
  }
})
