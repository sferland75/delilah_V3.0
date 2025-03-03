// Mock window.fs
declare global {
  interface Window {
    fs: {
      readFile: jest.Mock;
      writeFile: jest.Mock;
      readdir: jest.Mock;
      mkdir: jest.Mock;
      stat: jest.Mock;
    };
  }
}

global.window = {
  ...window,
  fs: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    readdir: jest.fn(),
    mkdir: jest.fn(),
    stat: jest.fn()
  }
};

// Add test file operations
global.window.fs.writeFile.mockImplementation(async (path: string, data: any) => {
  console.log(`Mock writeFile: ${path}`);
  return Promise.resolve();
});

global.window.fs.readFile.mockImplementation(async (path: string) => {
  console.log(`Mock readFile: ${path}`);
  return Promise.resolve(new Uint8Array());
});

export {};