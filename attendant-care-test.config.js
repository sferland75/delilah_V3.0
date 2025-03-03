module.exports = {
  testEnvironment: 'jsdom',
  rootDir: '.',
  setupFilesAfterEnv: [
    '<rootDir>/src/sections/9-AttendantCare/__tests__/jest.setup.ts'
  ],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1'
  },
  testPathIgnorePatterns: [
    '/node_modules/', 
    '/.next/',
    'jest.setup.ts'
  ],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/sections/9-AttendantCare/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/*.setup.ts',
  ],
  moduleDirectories: ['node_modules', 'src'],
  testMatch: [
    '**/9-AttendantCare/__tests__/calculations.test.ts'
  ],
  // Use manual mocks
  modulePathIgnorePatterns: [],
  // Allow virtual mocks
  virtual: true,
  // Silence Node.js deprecation warnings
  silent: true
};