import { JSONErrorHandler, GithubErrorThrowHandler} from "../ErrorHandlers"
import { Octokit } from "octokit"

class GithubInterface {
    private readonly _username: string
    private readonly _octokit: Octokit

    private readonly _waittime: number = 5
    private readonly _incorrectTokenDelay: number = 526000

    constructor(username: string, token: string) {
        this._username = username
        this._octokit = new Octokit({
            auth: token
        })
    }

    public async Get(owner: string, repo: string): string {
        await this._octokit.rest.git
    }

}

export default GithubInterface