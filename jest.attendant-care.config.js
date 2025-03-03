module.exports = {
  testEnvironment: 'jsdom',
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
    '<rootDir>/src/sections/9-AttendantCare/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/sections/9-AttendantCare/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  // Silence Node.js deprecation warnings
  silent: true
};