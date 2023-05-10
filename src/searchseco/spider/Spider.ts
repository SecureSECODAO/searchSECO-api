import GitSpider from "./GitSpider";
import { exec } from 'child_process';
import * as fs from 'fs';

export default class Spider {
    getSpider(url: string): Spider | null {
        const pattern = RegExp('https://(www\\.)?(github|gitlab)\\.com([^ ]*)');

        if (pattern.test(url)) {
            return new GitSpider();
        }

        return null;
    }

    async setupSpider(url: string, threads: number): Promise<Spider> {
        // Check which spider to use for link.
        const spider = this.getSpider(url);

        if (!spider) {
            throw new Error('Unable to get Spider for given URL');
        }

        // Set up spider.
        //spider.setThreads(threads);
        //spider.setParsableExts(EXTS);

        return spider;
    }

    downloadRepo(spider: Spider, url: string, filePath: string, branch: string): Promise<void> {
        console.log('Downloading project source files from the ${branch} branch');

        console.log('Deleting old files from ./${filePath}/');

        if (fs.existsSync(filePath)) {
            if (process.platform === "win32") {
                exec('rmdir "${filePath}" /S /Q');
            } 
            else {
                exec('rm -rf ${filePath}');
            }
        }

        try{
            await spider.download()
        }
    }

}