import { Crawler } from "../../src/searchseco/crawler/Crawler";

describe('Crawler', () => {
    it('crawl', async () => {
        const crawler = new Crawler("PUT_PAT_HERE", 100, 5);

        const crawlData = await crawler.crawl();

        console.log(JSON.stringify(crawlData, null, 2));

        // Check structure
        expect(crawlData).toHaveProperty('URLImportanceList');
        expect(crawlData).toHaveProperty('languages');
        expect(crawlData).toHaveProperty('finalProjectId');

        // Check if we have data
        expect(crawlData.URLImportanceList.length).toBeGreaterThan(0);
    }, 30000);
});
