import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({
  asyncUtilTimeout: 5000
});

// Mock requestAnimationFrame for React useEffect in testing environment
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
  return 0;
};

// Clear any mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
