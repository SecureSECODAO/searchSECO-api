import { Octokit } from 'octokit'
import * as fs from 'fs'
import rp from 'request-promise'

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const baseUrl = 'https://api.github.com'

export default class GithubInterface {
    private readonly _octokit: Octokit

    constructor(token: string) {
        this._octokit = new Octokit({
            auth: token,
        })
    }

    private static parseURL(url: string) {
        const [_, owner, repo] = url.replace('https://', '').split('/')
        return { owner, repo }
    }

    private async fetchRepo(owner: string, repo: string) {
        const response = await this._octokit.request("GET /repos/{owner}/{repo}", {
            owner,
            repo
        })
        return response.data
    }

    public async DownloadRepository(url: string): Promise<{login: string, name: string, ref: string} | undefined> {
        const { owner, repo } = GithubInterface.parseURL(url)
        const { name, owner: { login }, default_branch: ref } = await this.fetchRepo(owner, repo)
        const metadata = { login, name, ref }
        const targetPath = `./temp/${login}-${name}-${ref}.zip`

        if (fs.existsSync(targetPath))
            return metadata

        const options = {
            headers: {
                'User-Agent': 'downloader'
            },
            uri: `${baseUrl}/repos/${login}/${name}/zipball/${ref}`,
            followAllRedirects: true
        }
        try {
            await rp(options).pipe(fs.createWriteStream(targetPath))
            return metadata
        } catch (err) {
            console.log(err)
            return undefined
        }
    }
}


