import fs from 'fs';
import path from 'path';

const testOutputPath = path.join(process.cwd(), 'test_output.txt');

export const cleanupTestOutput = () => {
  try {
    if (fs.existsSync(testOutputPath)) {
      const fd = fs.openSync(testOutputPath, 'w');
      fs.closeSync(fd);
    }
  } catch (error) {
    console.warn('Could not cleanup test output:', error);
  }
};

export const appendTestOutput = (content: string) => {
  try {
    fs.appendFileSync(testOutputPath, content + '\n');
  } catch (error) {
    console.warn('Could not append to test output:', error);
  }
};
