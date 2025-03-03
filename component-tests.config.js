module.exports = {
  testEnvironment: 'jsdom',
  rootDir: '.',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest'
  },
  testMatch: [
    '**/9-AttendantCare/__tests__/*.(test|spec).tsx'
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/components/ui/(.*)$': '<rootDir>/src/sections/9-AttendantCare/__tests__/__mocks__/components',
    '^@/components/(.*)$': '<rootDir>/src/sections/9-AttendantCare/__tests__/__mocks__/components',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    '<rootDir>/src/sections/9-AttendantCare/__tests__/jest.setup.ts'
  ],
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  // Silence Node.js deprecation warnings
  silent: true
};