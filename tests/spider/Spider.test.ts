import Spider from '../../src/searchseco/spider/Spider';
import fs, { mkdtempSync, rmSync } from 'fs';;
import * as path from 'path';

const tempDir = mkdtempSync(path.join(__dirname, '.tmp'));

describe('Spider', () => {
  let spider: Spider;

  beforeAll(() => {
    spider = new Spider();

    const url = 'https://github.com/i-voted-for-trump/is-odd';
    const branch = 'master';

    return spider.downloadRepo(url, tempDir, branch);
  });

  afterAll(() => {
    rmSync(tempDir, { recursive: true });
  });

  describe('downloadRepo', () => {
    it('clone repo and checkout specified branch', async () => {

        const filePath = path.join(tempDir, 'index.js');
        const fileExists = fs.existsSync(filePath);
        expect(fileExists).toBe(true);
    });
  });
});