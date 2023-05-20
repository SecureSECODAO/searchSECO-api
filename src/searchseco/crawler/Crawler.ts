import { Octokit } from 'octokit';

interface CrawlData {
    URLImportanceList: Array<{ url: string, importance: number, finalProjectId: number }>;
    language: LanguageCount;
    finalProjectId: number;
}

interface LanguageCount {
    [key: string]: number;
}

class Crawler {
    private octo: Octokit;
    private repoPerPage: number;

    constructor(token: string, repoPerPage: number = 100) {
        this.octo = new Octokit({ auth: token });
        this.repoPerPage = repoPerPage;
    }

    private async getRepos(page: number): Promise<any> {
        return await this.octo.request('GET /search/repositories', {
            q: 'fork: false',   // Replace with an actual query? Maybe date?
            sort: 'stars',
            order: 'desc',
            per_page: this.repoPerPage,
            page: page
        });
    }
}


