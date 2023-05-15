import { Clone, Repository } from 'nodegit';
import * as fs from 'fs';
import * as path from 'path';
const glob = require('glob');

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

type AuthorData = Map<string, CodeBlock[]>;

export default class Spider {
    private repo: Repository | null = null;

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
            await Clone(url, filePath, {});
            this.repo = await Repository.open(filePath);
            await this.checkoutBranch(branch);
        }
        catch (error){
            console.error(`Failed to download ${url} to ${filePath}: ${error}`);
            throw error;
        }
    }

    // /**
    //  * Updates project from one version to another, keeping track of unchanged files.
    //  * Versions should be in chronological order. Deletes unchanged files from local project.
    //  *
    //  * @param filePath Local path where project is stored.
    //  * @param prevTag Name of current version.
    //  * @param newTag Name of version to update to.
    //  * @returns Unchanged files between versions.
    //  */
    // async updateRepo(filePath: string, prevTag: string, newTag: string, prevUnchangedFiles: string[]): Promise<string[]> {
    //     if (!this.repo) {
    //         throw new Error('Repository not initialized.');
    //     }

    //     let changedFiles: string[] = [];

    //     if (prevTag) {
    //         const oldCommit = await this.repo.getReferenceCommit(prevTag);
    //         const newCommit = await this.repo.getReferenceCommit(newTag);
    //         const diffList = await nodegit.Diff.treeToTree(this.repo, await oldCommit.getTree(), await newCommit.getTree(), null);
    //         const patches = await diffList.patches();
    //         await Promise.all(patches.map(async (patch: nodegit.ConvenientPatch) => {
    //             changedFiles.push(patch.newFile().path());
    //         }));
    //     }

    //     await this.checkoutBranch(newTag);

    //     const allFiles: string[] = await new Promise((resolve, reject) => {
    //         glob("**/*", { cwd: filePath, nodir: true, ignore: '**/.git/**' }, (err: Error | null, matches: string[]) => {
    //             if (err) reject(err);
    //             else resolve(matches);
    //         });
    //     });

    //     const unchangedFiles = allFiles.filter(file => !changedFiles.includes(file));

    //     const removedFiles: string[] = [];
    //     for (const file of unchangedFiles) {
    //         if (prevUnchangedFiles.includes(file)) {
    //             await fs.promises.unlink(path.join(filePath, file));
    //             removedFiles.push(file);
    //         }
    //     }

    //     return removedFiles;
    // }

    // /**
    //  * Switches local project to different version.
    //  *
    //  * @param tag Name of the version to update to.
    //  * @param filePath Local path where project is stored.
    // */
    // async switchVersion(tag: string): Promise<void> {
    //     try {
    //         if (!this.repo) {
    //             throw new Error('Repository not initialized.');
    //         }
    //         await this.checkoutBranch(tag);
    //     } catch (error) {
    //         console.error(`Failed to switch to version ${tag}: ${error}`);
    //         throw error;
    //     }
    // }

    private async checkoutBranch(branchName: string): Promise<void> {
        if (!this.repo) {
            throw new Error('Repository not initialized.');
        }
        const reference = await this.repo.getReference(branchName);
        await this.repo.checkoutRef(reference); 
    }

    // /**
    // * Trims the local files to only keep the specified ones.
    // *
    // * @param filePath The path into which the project was cloned.
    // * @param lines The files to keep.
    // */
    // async trimFiles(filePath: string, lines: Map<string, number[]>): Promise<void> {
    //     try {
    //         const files: string[] = await new Promise((resolve, reject) => {
    //             glob("**/*", { cwd: filePath, nodir: true, ignore: '**/.git/**' }, (err: Error | null, matches: string[]) => {
    //                 if (err) reject(err);
    //                 else resolve(matches);
    //             });
    //         });

    //         for (const file of files) {
    //             const fileString: string = path.normalize(file).replace(filePath, '');
    //             if (!lines.has(fileString)) {
    //                 await fs.promises.unlink(path.join(filePath, fileString));
    //             }
    //         }
    //     } catch (error) {
    //         console.error(`Failed to trim files in ${filePath}: ${error}`);
    //     }
    // }

    // /**
    // * Retrieves and returns author information for all files in the given repository.
    // *
    // * The method opens the repository, retrieves all files, and for each file, 
    // * retrieves all blocks of code along with the commit data for each block.
    // * The commit data includes information about the author and committer, 
    // * as well as the summary and hash of the previous commit.
    // *
    // * @param repoPath The path to the repository.
    // * @returns A promise that resolves to a Map. 
    // *          Each key in the Map is a filename and each value is an array of code blocks. 
    // *          Each code block includes the line number, number of lines, and commit data for the block.
    // * @throws Error if the repository is not initialized.
    // */
    // async downloadAuthor(repoPath: string): Promise<AuthorData> {
    //     try {
    //         if (!this.repo) {
    //             throw new Error('Repository not initialized.');
    //         }
    //         const repo = await nodegit.Repository.open(repoPath);
    //         const files = await this.getAllFiles(repoPath);
    //         const authorData: AuthorData = new Map();
    
    //         // Process each file
    //         for (const file of files) {
    //             const codeBlocks = await this.processFile(repo, file);
    //             authorData.set(file, codeBlocks);
    //         }
    
    //         return authorData;
    //     } catch (error) {
    //         console.error('An error occurred:', error);
    //         throw error;
    //     }
    // }
    
    // private async processFile(repo: nodegit.Repository, file: string): Promise<CodeBlock[]> {
    //     if (!this.repo) {
    //         throw new Error('Repository not initialized.');
    //     }
    //     const blame = await nodegit.Blame.file(repo, file);
    //     const numHunks = blame.getHunkCount();
    
    //     const codeBlocks: CodeBlock[] = [];
    
    //     for (let i = 0; i < numHunks; i++) {
    //         const hunk = blame.getHunkByIndex(i);
    //         const commit = await repo.getCommit(hunk.finalCommitId());
    
    //         const author = commit.author();
    //         const committer = commit.committer();
            
    //         const commitData: CommitData = {
    //             author: author.name(),
    //             authorMail: author.email(),
    //             authorTime: author.when().toString(),
    //             authorTz: author.when().offset.toString(),
    //             committer: committer.name(),
    //             committerMail: committer.email(),
    //             committerTime: committer.when().toString(),
    //             committerTz: committer.when().offset.toString(),
    //             summary: commit.summary(),
    //             previousHash: hunk.origCommitId().tostrS(),
    //             fileName: hunk.origPath(),
    //         };
    
    //         codeBlocks.push({
    //             line: hunk.finalStartLineNumber(),
    //             numLines: hunk.linesInHunk(),
    //             commit: commitData,
    //         });
    //     }
    
    //     return codeBlocks;
    // }

    // private async getAllFiles(repoPath: string): Promise<string[]> {
    //     const allFiles = await fs.promises.readdir(repoPath, { withFileTypes: true });
    //     const fileNames = allFiles
    //         .filter(dirent => dirent.isFile() && !/^.git/.test(dirent.name))
    //         .map(dirent => dirent.name);

    //     return fileNames;
    // }
}