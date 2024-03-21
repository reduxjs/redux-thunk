import type { Options } from 'tsup'
import { defineConfig } from 'tsup'

export default defineConfig(options => {
  const commonOptions: Partial<Options> = {
    entry: {
      'redux-thunk': 'src/index.ts'
    },
    ...options
  }

  return [
    {
      ...commonOptions,
      format: ['esm'],
      outExtension: () => ({ js: '.mjs' }),
      dts: true,
      clean: true
    },
    // Support Webpack 4 by pointing `"module"` to a file with a `.js` extension
    {
      ...commonOptions,
      format: ['esm'],
      target: 'es2017',
      dts: false,
      outExtension: () => ({ js: '.js' }),
      entry: { 'redux-thunk.legacy-esm': 'src/index.ts' }
    },
    {
      ...commonOptions,
      format: 'cjs',
      outDir: './dist/cjs/',
      outExtension: () => ({ js: '.cjs' })
    }
  ]
})
