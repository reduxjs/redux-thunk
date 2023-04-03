import { defineConfig, Options } from 'tsup'
import fs from 'fs'

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
      clean: true,
      onSuccess() {
        // Support Webpack 4 by pointing `"module"` to a file with a `.js` extension
        fs.copyFileSync(
          'dist/redux-thunk.mjs',
          'dist/redux-thunk.legacy-esm.js'
        )
      }
    },
    {
      ...commonOptions,
      format: 'cjs',
      outDir: './dist/cjs/',
      outExtension: () => ({ js: '.cjs' })
    }
  ]
})
