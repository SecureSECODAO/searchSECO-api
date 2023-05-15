import * as nodegit from 'nodegit';
import * as fs from 'fs';
import * as path from 'path';

export default class Spider {
    private repo: nodegit.Repository | null = null;
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
            await nodegit.Clone.clone(url, filePath, {});
            this.repo = await nodegit.Repository.open(filePath);
            await this.checkoutBranch(branch);
        }
        catch (error){
            console.error(`Failed to download ${url} to ${filePath}: ${error}`);
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
        undefined;
    }

    /**
     * Switches local project to different version.
     *
     * @param tag Name of the version to update to.
     * @param filePath Local path where project is stored.
    */
    async switchVersion(tag: string): Promise<void> {
        try {
            if (!this.repo) {
                throw new Error('Repository not initialized.');
            }
            await this.checkoutBranch(tag);
        } catch (error) {
            console.error(`Failed to switch to version ${tag}: ${error}`);
            throw error;
        }
    }

    private async checkoutBranch(branchName: string): Promise<void> {
        if (!this.repo) {
            throw new Error('Repository not initialized.');
        }
        const commit = await this.repo.getBranchCommit(branchName);
        await this.repo.checkoutBranch(commit, {});
    }
}