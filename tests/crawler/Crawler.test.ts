import { Crawler } from "../../src/searchseco/crawler/Crawler";

describe('Crawler', () => {
    it('crawlData ', async () => {
        const crawler = new Crawler("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", 100, 5);

        const crawlData = await crawler.crawl();

        console.log(JSON.stringify(crawlData, null, 2));

        // Check structure
        expect(crawlData).toHaveProperty('URLImportanceList');
        expect(crawlData).toHaveProperty('languages');
        expect(crawlData).toHaveProperty('finalProjectId');

        // Check if we have data
        expect(crawlData.URLImportanceList.length).toBeGreaterThan(0);
    }, 30000);

    it('getProjectMetadata ', async () => {
        const crawler = new Crawler("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", 100, 5);

        // Fetch some repos for testing
        const repos = await crawler.getRepos(1);

        // Use first repo for testing
        const repo = repos.data.items[0];

        const metadata = await crawler.getProjectMetadata(repo);

        console.log(JSON.stringify(metadata, null, 2));

        // Check structure
        expect(metadata).toHaveProperty('version');
        expect(metadata).toHaveProperty('license');
        expect(metadata).toHaveProperty('name');
        expect(metadata).toHaveProperty('url');
        expect(metadata).toHaveProperty('authorName');
        expect(metadata).toHaveProperty('authorMail');
        expect(metadata).toHaveProperty('defaultBranch');

        // Check if we have data
        expect(metadata.name).toEqual(repo.name);
    }, 30000);
});
