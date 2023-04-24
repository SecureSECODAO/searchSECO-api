import { Octokit } from 'octokit'
import * as fs from 'fs'
import rp from 'request-promise'
import JSZip from 'jszip'
import unzip from 'unzip-stream'

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

    private async unpack(path: string) {
       fs.createReadStream(`${path}.zip`).pipe(unzip.Extract({ path }))
    }

    public async DownloadRepository(url: string): Promise<string | undefined> {
        const { owner, repo } = GithubInterface.parseURL(url)
        const { name, owner: { login }, default_branch: ref } = await this.fetchRepo(owner, repo)
        const targetPath = `./.temp/${login}-${name}-${ref}`

        if (fs.existsSync(targetPath))
            return targetPath

        const options = {
            headers: {
                'User-Agent': 'downloader'
            },
            uri: `${baseUrl}/repos/${login}/${name}/zipball/${ref}`,
            followAllRedirects: true
        }

        const writer = fs.createWriteStream(`${targetPath}.zip`)
        rp(options).pipe(writer)

        while (!writer.writableEnded) {
            await sleep(500)
        }

        await this.unpack(targetPath)
        return targetPath
    }
}


