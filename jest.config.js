module.exports = {
  roots: ['<rootDir>/__test__'],
  // setupFiles: ['<rootDir>/__test__/base/setup-file.ts'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@app(.*)$': '<rootDir>/src$1',
  },
  testRegex: '(.+)\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
