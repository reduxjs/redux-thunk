import type { Options } from 'tsup'
import { defineConfig } from 'tsup'
import fs from 'fs/promises'

export default defineConfig(options => {
  const commonOptions: Partial<Options> = {
    entry: {
      'redux-thunk': 'src/index.ts'
    },
    tsconfig: 'tsconfig.build.json',
    ...options
  }

  return [
    {
      ...commonOptions,
      format: ['esm'],
      outExtension: () => ({ js: '.mjs' }),
      dts: true,
      clean: true,
      async onSuccess() {
        // Support Webpack 4 by pointing `"module"` to a file with a `.js` extension
        await fs.copyFile(
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
