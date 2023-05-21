import { Octokit } from 'octokit';

interface CrawlData {
    URLImportanceList: Array<{ url: string, importance: number, finalProjectId: number }>;
    languages: LanguageCount;
    finalProjectId: number;
}

interface LanguageCount {
    [key: string]: number;
}

export class Crawler {
    private octo: Octokit;
    private repoPerPage: number;
    private maxRepos: number;

    constructor(token: string, repoPerPage: number = 100, maxRepos: number = 5) {
        this.octo = new Octokit({ auth: token });
        this.repoPerPage = repoPerPage;
        this.maxRepos = maxRepos;
    }

    /**
     * Return repos based on the query.
     * @param page Page number to get repos from
     */
    private async getRepos(page: number): Promise<any> {
        return await this.octo.request('GET /search/repositories', {
            q: 'fork: false',   // Replace with an actual query? Maybe date?
            sort: 'stars',
            order: 'desc',
            per_page: this.repoPerPage,
            page: page
        });
    }

    private async getLanguages(url: string): Promise<LanguageCount> {
        const res = await this.octo.request(`GET ${url}`);
        return res.data;
      }

    /**
     * Crawls per page, starting from page 1.
     * 
     * Creates a list of repos containing the URL, importance, and project ID.
     * 
     */
    public async crawl(): Promise<CrawlData> {
        const URLImportanceList: Array<{url: string, importance: number, finalProjectId: number}> = [];
        const languages: LanguageCount = {};

        let page = 1;
        let finalProjectId: number = 0;

        let totalProcessedRepos = 0;
        while (totalProcessedRepos < this.maxRepos) {
            try {
                const repos = await this.getRepos(page);
                console.log(repos.data.items);
                if (repos.data.items.length === 0)
                    break;
                totalProcessedRepos += repos.data.items.length;
                const promises = repos.data.items.map(async (repo: any) => {
                    const url = repo.html_url;
                    const importance = repo.stargazers_count;
                    const projectId = repo.id;
          
                    URLImportanceList.push({ url, importance, finalProjectId: projectId });
                    finalProjectId = projectId;
          
                    const repoLanguages = await this.getLanguages(repo.languages_url);
                    for (const lang in repoLanguages) {
                      languages[lang] = languages[lang] ? languages[lang] + 1 : 1;
                    }
                  });
          
                  await Promise.all(promises);
                  page++;
            }
            catch (e){
                console.log(e);
                break;
            }
        }

        return { URLImportanceList, languages, finalProjectId };
    }
}


