/**
 * Jest configuration for Load Assessment tests
 */

module.exports = {
  testMatch: [
    "<rootDir>/src/components/__tests__/LoadAssessment.test.tsx",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverageFrom: [
    "<rootDir>/src/components/LoadAssessment.tsx"
  ]
};
