import { Octokit } from 'octokit'
import * as fs from 'fs'
import rp from 'request-promise'
import unzip from 'unzip-stream'


export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const baseUrl = 'https://api.github.com'


/**
 * This is the Github interface the API uses to download repositories.
 * @param token The Github Access token
 */
export class GithubInterface {
    private readonly _octokit: Octokit

    constructor(token: string) {
        this._octokit = new Octokit({
            auth: token,
        })
    }

    /** 
     * Extracts the owner and repository name of a github URL
     * @param url The url to extract the owner and name from
     * @returns A tuple containing the owner and repo name
     */
    private static parseURL(url: string): { owner: string, repo: string } {
        const [_, owner, repo] = url.replace('https://', '').split('/')
        return { owner, repo }
    }

    /** 
     * Fetches repository metadata based on the owner and name of a repository
     * @param owner The owner of the repository
     * @param repo The repository name
     * @returns Repository metadata
     */
    private async fetchRepo(owner: string, repo: string) {
        const response = await this._octokit.request("GET /repos/{owner}/{repo}", {
            owner,
            repo
        })
        return response.data
    }

    /** 
     * Unpacks a zip into a folder of the same name.
     * @param path The path of the zip to extract. This path is without the suffix
     */
    private async unpack(path: string) {
        const reader =  fs.createReadStream(`${path}.zip`)
        reader.pipe(unzip.Extract({ path }))
        while (!reader.readableEnded)
            await sleep(100)
    }

    /** 
     * Downloads a Github repository based on a generic Github URL
     * @param url The repository URL to download
     * @returns The directory name where the downloaded repo is located. If the download failed, this returns undefined.
     */
    public async DownloadRepository(url: string): Promise<string | undefined> {
        try {
            const { owner, repo } = GithubInterface.parseURL(url)
            const { name, owner: { login }, default_branch: ref } = await this.fetchRepo(owner, repo)
            
            const dirName =  `${login}-${name}-${ref}`
            const targetPath = `./.temp/${dirName}`

            if (fs.existsSync(targetPath))
                return dirName

            const options = {
                headers: {
                    'User-Agent': 'downloader'
                },
                uri: `${baseUrl}/repos/${login}/${name}/zipball/${ref}`,
                followAllRedirects: true
            }

            const writer = fs.createWriteStream(`${targetPath}.zip`)
            rp(options).pipe(writer)

            while (!writer.writableFinished) {
                await sleep(100)
            }

            await this.unpack(targetPath)

            return dirName
        }
        catch (e) {
            console.log(e)
            return undefined
        }
    }

    /**
     * Removes a specific directory from the cache
     * @param dirName The directory to remove
     */
    public static async ClearCache(dirName: string) {
        let zip_removed = false
        let dir_removed = false
    
        fs.unlink(`./.temp/${dirName}.zip`, (err) => {
            if (err) throw err
            zip_removed = true
        })
    
        fs.rm(`./.temp/${dirName}`, { recursive: true, force: true }, (err) => {
            if (err) throw err
            dir_removed = true
        })
    
        while (!zip_removed && dir_removed)
            await sleep(500)
    }
}


