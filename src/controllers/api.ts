import { Request, Response } from "express";
import Spider from "../searchseco/searchSECO-spider/src/Spider";
import Parser from "../searchseco/searchSECO-parser/src/Parser";
import { TCPClient } from "../searchseco/searchSECO-databaseAPI/src/Client";
import config from "../config/config";
import path from 'path'
import fs from 'fs'
import { Verbosity } from "../searchseco/searchSECO-parser/src/searchSECO-logger/src/Logger";

const DOWNLOAD_LOCATION = path.join(__dirname, '../../.tmp')

export async function fetch(req: Request, res: Response): Promise<void> {
    try {
        const { url, branch, token, address } = req.body;

        const result = await fetchHashes(url, branch, token);

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
export async function fetchHashes(url: string, branch: string, token: string) {
    const spider = new Spider();
    await spider.downloadRepo(url, DOWNLOAD_LOCATION, branch)

    const { result } = await Parser.ParseFiles(DOWNLOAD_LOCATION, Verbosity.SILENT);

    fs.rmSync(DOWNLOAD_LOCATION, { force: true, recursive: true })
    
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
        config.DB_HOST || "127.0.0.1",
        config.DB_PORT || 8003,
        Verbosity.SILENT
    );
    const [methodData, authorData, projectData] = (
        await tcpClient.Check(hashes)
    ).map((res) => res.response);

    // sanitize email
    authorData.forEach(
        (author: any) => (author.email = author.email.replace(/<|>/g, ""))
    );

    const formatted = {
        methodData,
        authorData,
        projectData,
    };

    return formatted;
}
