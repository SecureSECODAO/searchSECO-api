import Parser from './src/parser/Parser'
import { GithubInterface } from './src/GithubInterface';
import antlr4 from 'antlr4';
import path from 'path';
import fs from 'fs';


(async () => {
    const githubInterface = new GithubInterface(process.env.GITHUB_TOKEN || '')

    const dirName = await githubInterface.DownloadRepository("https://github.com/i-voted-for-trump/is-odd")

    if (!dirName) {
        console.log(`${dirName} not found.`)
        return
    }

    const { filenames, result } = await Parser.ParseFiles({ path: dirName })
    
    await GithubInterface.ClearCache(dirName)

    console.log(result.values())
})()

