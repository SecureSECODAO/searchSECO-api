import Spider from "../../src/searchseco/spider/Spider";
import fs, { mkdtempSync, rmSync } from "fs";
import * as path from "path";
import { exec } from 'child_process';


const tempDir = mkdtempSync(path.join(__dirname, "../../.tmp"));

describe("Spider", () => {
    let spider: Spider;

    beforeAll(() => {
        spider = new Spider();

        const url = "https://github.com/i-voted-for-trump/is-odd";
        const branch = "master";

        return spider.downloadRepo(url, tempDir, branch);
    });

    afterAll((done) => {
      exec(`rd /s /q "${tempDir}"`, (error) => {
          if (error) {
              console.error(`Error deleting temp directory: ${error}`);
          }
          done();
      });
  });

    describe("downloadRepo", () => {
        it("clone repo and checkout specified branch", async () => {
            const filePath = path.join(tempDir, "index.js");
            const fileExists = fs.existsSync(filePath);
            expect(fileExists).toBe(true);
        });
    });
});
