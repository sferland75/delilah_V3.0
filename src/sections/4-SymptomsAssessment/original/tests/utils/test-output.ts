import fs from 'fs';
import { promisify } from 'util';
import { join } from 'path';

export class TestOutput {
  private path: string;
  private writeQueue: Promise<void>;

  constructor(filename: string = 'test_output.txt') {
    this.path = join(process.cwd(), filename);
    this.writeQueue = Promise.resolve();
  }

  private async writeWithRetry(content: string, operation: 'write' | 'append', retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        if (operation === 'write') {
          await promisify(fs.writeFile)(this.path, content, { flag: 'w' });
        } else {
          await promisify(fs.appendFile)(this.path, content + '\n', { flag: 'a' });
        }
        return;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, i)));
      }
    }
  }

  async write(content: string): Promise<void> {
    this.writeQueue = this.writeQueue.then(() => this.writeWithRetry(content, 'write'));
    return this.writeQueue;
  }

  async append(content: string): Promise<void> {
    this.writeQueue = this.writeQueue.then(() => this.writeWithRetry(content, 'append'));
    return this.writeQueue;
  }

  async clear(): Promise<void> {
    return this.write('');
  }
}

// Export singleton instance
export const testOutput = new TestOutput();