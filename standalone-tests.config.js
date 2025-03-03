module.exports = {
  testEnvironment: 'node',
  rootDir: '.',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest'
  },
  testMatch: [
    '**/9-AttendantCare/__tests__/calculations.flexible.test.ts',
    '**/9-AttendantCare/__tests__/schema.test.ts',
    '**/9-AttendantCare/__tests__/schema.partial.test.ts'
  ],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // No setup files that could cause issues
  // Silence Node.js deprecation warnings
  silent: true
};