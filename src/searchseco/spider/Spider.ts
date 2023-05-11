import simpleGit, { SimpleGit } from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';

interface CommitData {
    author: string;
    authorMail: string;
    authorTime: string;
    authorTz: string;
    committer: string;
    committerMail: string;
    committerTime: string;
    committerTz: string;
    summary: string;
    previousHash: string;
    fileName: string;
}

interface CodeBlock {
    line: number;
    numLines: number;
    commit: CommitData;
}

export default class Spider {
    private git: SimpleGit;

    constructor() {
        this.git = simpleGit();
    }

    /**
     * Downloads a repository from a given source and stores it
     * locally at the location defined by filePath.
     *
     * @param url Url to source to download.
     * @param filePath Local path where to store the source.
     * @param branch Branch of the source to download.
     */
    async downloadRepo(url: string, filePath: string, branch: string): Promise<void> {
        try {
            await this.git.clone(url, filePath);
            this.git.cwd(filePath);
            await this.git.checkout(branch);
        }
        catch (error){
            console.error('Failed to download ${url} to ${filePath}: ${error}');
            throw error;
        }
    }

    /**
     * Updates project from one version to another, keeping track of unchanged files.
     * Versions should be in chronological order. Deletes unchanged files from local project.
     *
     * @param filePath Local path where project is stored.
     * @param prevTag Name of current version.
     * @param newTag Name of version to update to.
     * @returns Unchanged files between versions.
     */
    async updateRepo(filePath: string, prevTag: string, newTag: string, prevUnchanged: string[]): Promise<string[]> {
        const git = simpleGit(filePath);
        let unchanged: string[] = [];

        try{
            await git.fetch();
            await git.checkout(newTag);

            const diffSummary = await git.diffSummary([prevTag, newTag]);
            // Delete unchanged

            return unchanged;
        }
        catch{}
    }

    /**
     * Switches local project to different version.
     *
     * @param tag Name of the version to update to.
     * @param filePath Local path where project is stored.
     */
    async switchVersion(tag: string, filePath: string): Promise<void> {
        try {
            const git = simpleGit(filePath);
            await git.checkout(tag);
        }
        catch (error){
            console.error('Failed to switch to version ${tag} at ${filePath}: ${error}');
            throw error;
        }
    }

    /**
     * Extracts author data from locally stored project.
     *
     * @param filePath Local path where project is stored.
     * @returns AuthorData object containing extracted author data.
     */
    async getAuthors(filePath: string): Promise<Map<string, string[]>> {
        try {
            const git = simpleGit(filePath);
            const files = fs.readdirSync(filePath);
            const authorData = new Map<string, string[]>();

            for (const file of files) {
                if (fs.lstatSync(path.join(filePath, file)).isDirectory()) {
                    continue;
                }

                const blameRaw: string = await git.raw(['blame', file]);
                const blameLines = blameRaw.split('\n');
                const authors = blameLines.map(line => {
                    const match = line.match(/\((.*?)\s*\d{4}/);
                    return match ? match[1].trim() : 'Unknown';
                });

                authorData.set(file, authors);
            }

            return authorData;
        } catch (error) {
            console.error(`Failed to get authors from ${filePath}: ${error}`);
            throw error;
        }
    }
}