import Parser from './src/parser/Parser'
import { GithubInterface } from './src/spider/GithubInterface';
import antlr4 from 'antlr4';
import path from 'path';
import fs from 'fs';
import HashData from './src/utils/HashData';
import { TCPClient } from './src/databaseAPI/Client';
import { RequestType } from './src/databaseAPI/Request';


(async () => {
    const githubInterface = new GithubInterface(process.env.GITHUB_TOKEN || '')

    const dirName = await githubInterface.DownloadRepository("https://github.com/i-voted-for-trump/is-odd")

    if (!dirName) {
        console.log(`${dirName} not found.`)
        return
    }

    const { filenames, result } = await Parser.ParseFiles({ path: dirName })

    await GithubInterface.ClearCache(dirName)

    const hashes = result.map((r: HashData) => r.Hash)

    const client = new TCPClient("dao", 8003, "127.0.0.1")
    const response = await client.Check(hashes)

    console.log(JSON.stringify(response))
})()

