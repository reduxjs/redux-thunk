import { defineConfig, Options } from 'tsup'

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
    {
      ...commonOptions,
      format: 'cjs',
      outDir: './dist/cjs/',
      outExtension: () => ({ js: '.cjs' })
    }
  ]
})
