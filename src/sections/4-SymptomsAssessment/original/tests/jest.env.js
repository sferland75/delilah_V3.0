const Environment = require('jest-environment-jsdom');

module.exports = class CustomEnvironment extends Environment {
  async setup() {
    await super.setup();
    
    // Mock required browser APIs
    if (!this.global.document) {
      this.global.document = {}
    }
    
    if (!this.global.window) {
      this.global.window = {}
    }
    
    if (!this.global.navigator) {
      this.global.navigator = {
        userAgent: 'node.js',
        language: 'en-US',
        languages: ['en-US', 'en'],
        clipboard: {
          writeText: jest.fn(),
          readText: jest.fn()
        }
      }
    }

    // Mock window.fs
    const mockFS = {
      readFile: jest.fn(),
      writeFile: jest.fn(),
      readdir: jest.fn(),
      mkdir: jest.fn(),
      stat: jest.fn()
    };

    Object.defineProperty(this.global.window, 'fs', {
      value: mockFS,
      writable: true
    });

    // Mock window.computedStyle
    Object.defineProperty(this.global.window, 'computedStyle', {
      value: (element) => ({
        getPropertyValue: jest.fn().mockReturnValue(''),
        setProperty: jest.fn(),
        removeProperty: jest.fn()
      }),
      writable: true
    });

    // Add any other required browser APIs
    Object.defineProperty(this.global.window, 'matchMedia', {
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
      writable: true
    });

    // Mock IntersectionObserver
    this.global.IntersectionObserver = class IntersectionObserver {
      observe() { return null; }
      disconnect() { return null; }
      unobserve() { return null; }
    };

    // Mock ResizeObserver
    this.global.ResizeObserver = class ResizeObserver {
      observe() { return null; }
      disconnect() { return null; }
      unobserve() { return null; }
    };
  }
};