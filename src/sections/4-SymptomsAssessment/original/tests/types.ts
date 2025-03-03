declare global {
  interface Window {
    fs: {
      readFile: jest.Mock;
      writeFile: jest.Mock;
      readdir: jest.Mock;
      mkdir: jest.Mock;
      stat: jest.Mock;
    };
    computedStyle: typeof getComputedStyle;
  }

  namespace NodeJS {
    interface Global {
      computedStyle: typeof getComputedStyle;
    }
  }
}

export {};