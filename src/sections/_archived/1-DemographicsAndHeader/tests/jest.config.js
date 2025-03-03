module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./test-setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../../../src/$1'
  },
  moduleDirectories: ['node_modules', '<rootDir>/../../../src'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/../../../tsconfig.json'
    }]
  },
  testMatch: [
    '<rootDir>/**/*.test.{ts,tsx}'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};