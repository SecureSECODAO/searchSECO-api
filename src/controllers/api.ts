import { Request, Response } from "express";
import { GithubInterface } from "../searchseco/spider/GithubInterface";
import Parser from "../searchseco/parser/Parser";
import { TCPClient } from "../searchseco/databaseAPI/Client";
import config from "../config/config";

export async function fetch(req: Request, res: Response): Promise<void> {
    try {
        const { url, token, address } = req.body;

        const result = await fetchHashes(url, token);

        res.status(200).json(result);
    } catch (e: any) {
        console.log(e);
        res.status(e.status || 500).json(e);
    }
}

/**
 * Fetches hash data of the given repository.
 * @param url URL of the repository
 * @param token Github token
 * @returns List of HashData
 */
export async function fetchHashes(url: string, token: string) {
    const githubInterface = new GithubInterface(token);
    const dirName = await githubInterface.DownloadRepository(url);

    if (!dirName) throw new Error("Cannot find repository.");

    const { filenames, result } = await Parser.ParseFiles({
        path: dirName,
    });

    await GithubInterface.ClearCache(dirName);

    return result;
}

export async function check(req: Request, res: Response): Promise<void> {
    const { hashes } = req.body;

    const formatted = await checkHashes(hashes);

    res.status(200).json(formatted);
}

/**
 * A function that checks the hashes in the database and returns data for them.
 * @param hashes The hashes to retrieve data for
 * @returns An object containing the data for the hashes
 */
export async function checkHashes(hashes: string[]) {
    const tcpClient = new TCPClient(
        "dao",
        config.DB_PORT || 8003,
        config.DB_HOST || "127.0.0.1"
    );
    const [methodData, authorData, projectData] = (
        await tcpClient.Check(hashes)
    ).map((res) => res.response);

    // sanitize email
    authorData.forEach((author: any) => {
        if (author.email) author.email = author.email.replace(/<|>/g, "");
    });

    const formatted = {
        methodData,
        authorData,
        projectData,
    };

    return formatted;
}
