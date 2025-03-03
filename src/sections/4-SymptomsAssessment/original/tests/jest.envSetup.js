// Import jest-environment-jsdom
const JSDOMEnvironment = require('jest-environment-jsdom').default;

class CustomEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();

    const defaultStyle = {
      display: 'block',
      visibility: 'visible',
      transform: 'none',
      transition: 'none',
      animation: 'none',
      height: 'auto',
      width: 'auto',
      position: 'static',
      top: 'auto',
      left: 'auto',
      opacity: '1',
    };

    // Mock getComputedStyle globally
    this.global.getComputedStyle = jest.fn(() => ({
      ...defaultStyle,
      getPropertyValue: (prop) => defaultStyle[prop] || '',
      setProperty: jest.fn(),
      removeProperty: jest.fn(),
    }));

    // Mock computedStyle as an alias to getComputedStyle
    this.global.computedStyle = this.global.getComputedStyle;

    // Mock ResizeObserver
    this.global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    // Mock IntersectionObserver
    this.global.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe(element) {
        this.callback([{
          isIntersecting: true,
          intersectionRatio: 1,
          target: element
        }]);
      }
      unobserve() {}
      disconnect() {}
    };

    // Mock HTMLElement methods
    if (this.global.HTMLElement) {
      Object.defineProperties(this.global.HTMLElement.prototype, {
        scrollIntoView: { value: jest.fn() },
        scrollTo: { value: jest.fn() },
        focus: { value: jest.fn() },
        blur: { value: jest.fn() }
      });
    }

    // Mock matchMedia
    this.global.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Mock window.fs
    const mockFS = {
      readFile: jest.fn(),
      writeFile: jest.fn(),
      readdir: jest.fn(),
      mkdir: jest.fn(),
      stat: jest.fn()
    };

    // Add fs to window
    Object.defineProperty(this.global, 'fs', {
      value: mockFS,
      writable: true
    });

    // Add missing navigator properties
    Object.defineProperty(this.global, 'navigator', {
      value: {
        userAgent: 'node.js',
        language: 'en-US',
        languages: ['en-US', 'en'],
        clipboard: {
          writeText: jest.fn(),
          readText: jest.fn()
        }
      },
      writable: true
    });
  }
}

module.exports = CustomEnvironment;