import Spider from './Spider';

async function testDownloadRepo() {
    const spider = new Spider();
    try {
        const url = 'https://github.com/i-voted-for-trump/is-even'; 
        const filePath = '@/src/test/download';
        const branch = 'master';

        await spider.downloadRepo(url, filePath, branch);
        console.log(`Successfully downloaded repo from ${url} to ${filePath}`);
    } catch (error) {
        console.error(`Failed to download repo: ${error}`);
    }
}

testDownloadRepo();