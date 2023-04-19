import CrawlData from "../CrawlData";
import {GithubErrorThrowHandler, JSONErrorHandler} from "../ErrorHandlers";
import GithubInterface from "./GithubInterface";
import ProjectMetadata from "../ProjectMetadata";


class GithubCrawler {
    private _githubInterface: GithubInterface;

    private constructor(username?: string, token?: string, githubInterface?: GithubInterface) 
    {
        this._githubInterface = githubInterface ?? new GithubInterface(username ?? "", token ?? "")
    }

    /**
     * Creates a Crawler from an existing Github Interface
     * @param githubInterface The interface to construct the crawler from
     * @returns A Crawler instance
     */
    public static CreateCrawlerFromInterface(githubInterface: GithubInterface): GithubCrawler {
        return new GithubCrawler(
            undefined,
            undefined,
            githubInterface
        )
    }

    /**
     * Creates a Crawler from a username and token combination
     * @param username The username to use
     * @param token The token to use
     * @returns A Crawler instance
     */
    public static CreateCrawlerFromProfile(username: string, token: string): GithubCrawler {
        return new GithubCrawler(
            username,
            token,
            undefined
        )
    }

    /**
     * Gets the owner and repository name from a  given url
     * @param url The Github url to fetch from
     * @returns A tuple containing the owner and repository names
     */
    private getOwnerAndRepo(url: string): [string, string] {
        return ["", ""];
    }


    /**
     * Constructs a repository URL from a regular URL
     * @param url The url to convert
     * @returns A formatted Github URL
     */    
    private getRepoUrl(url: string): string {
        return ""
    }

    /**
     * Gets the number of stars associated with a repository
     * @param repoUrl The Github URL to retrieive the stars from
     * @param handler 
     * @returns The number of stars associated with the repo
     */
    private getStars(repoUrl: string, handler: GithubErrorThrowHandler): number {
        return 0
    }

    /**
     * Gets the fraction of parseable code from a repository
     * @param repoUrl A Github URL
     * @param languages The languages encountered
     * @param handler 
     * @returns The total number of parseable lines divided by the total number of lines, 
     * and 0 if the total is 0.
     */
    private getParseableRatio(repoUrl: string, languages: Map<string, number>, handler: GithubErrorThrowHandler): [number, number] {
        return [0, 0]
    }

    /**
     * Constructs project metadata from JSON
     * @param json The json object to retrieve the information from
     * @param ownerAndRepo The owner and repository names
     * @returns a ProjectMetadata instance
     */
    private constructProjectMetadata(json: JSON, ownerAndRepo: [string, string]): ProjectMetadata {
        return new ProjectMetadata()
    }
 
    /**
     * Constructs a new GithubErrorHandler that has the loggers of 403 and 404 replaced.
     * @returns A GithubErrorHandler instance
     */
    private getCorrectGithubHandler(): GithubErrorThrowHandler {
        return new GithubErrorThrowHandler()
    }

    /**
     * Constructs a new githuberrorhandler that has the logger of 422 replaced.
     * @returns A GithubErrorThrowHandler instance
     */
    private getGithubHandlerForJSONError(): GithubErrorThrowHandler {
        return new GithubErrorThrowHandler()
    }

    /**
     * Constructs a new JSONErrorHandler that gives a warning for the parse error instead of an error.
     * @returns A JSONErrorHandler instance
     */
    private getCorrectJSONHandler(): JSONErrorHandler {
        return new JSONErrorHandler()
    }

    /**
     * Gets the importance measure of a given project.
     * @param stars The number of stars
     * @param percentageAndBytes The percentage parseable code and the total amount of bytes
     * @returns An importance score
     */
    private getImportanceMeasure(stars: number, percentageAndBytes: [number, number]): number {
        return 0
    }

    /**
     * Gets the parse timeout of a given project.
     * @param stars The number of stars
     * @param percentageAndBytes The percentage parseable code and the total amount of bytes
     * @returns A parse timeout
     */
    private getTimeout(stars: number, percentageAndBytes: Map<string, number>): number {
        return 0
    }

    private logProgess(step: number, max: number = 100, stepSize: number = 10) {

    }

    private addUrl(branch: JSON, crawlData: CrawlData, handler: GithubErrorThrowHandler) {

    }

    private getCrawlData(json: JSON, handler: GithubErrorThrowHandler, currentStars: number): CrawlData {
        return new CrawlData()
    }

    public CrawlRepositories(start: number): CrawlData {
        return new CrawlData()
    }

    public GetProjectMetadata(url: string): ProjectMetadata {
        return new ProjectMetadata()
    }
}