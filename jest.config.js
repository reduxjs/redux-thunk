/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  testRegex: 'test/test.ts',
  globals: {
    'ts-jest': {
      tsconfig: './test/tsconfig.json',
    },
  },
};
