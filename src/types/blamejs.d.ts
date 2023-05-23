declare module 'blamejs' {
    export default class BlameJS {
        constructor();
        parseBlame(blameOutput: string): void;
        getCommitData(): { [key: string]: CommitData };
        getLineData(): LineData[];
    }

    export interface CommitData {
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
        filename: string;
    }

    export interface LineData {
        lineNumber: number;
        hash: string;
    }
}