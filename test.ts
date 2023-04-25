import Parser from './src/parser/parser.ts'
import { GithubInterface } from './src/GithubInterface.ts';
import antlr4 from 'antlr4';
import path from 'path';
import fs from 'fs';


(async () => {
    const files = ["./test/a.py"]
    const test_dir = 'i-voted-for-trump-is-odd-master'
    
    function getFiles(dir: string, acc: string[] = []): string[] {
        fs.readdirSync(dir).forEach((file: string) => {
            const abs_path = path.join(dir, file);
            if (fs.statSync(abs_path).isDirectory()) return getFiles(abs_path, acc);
            else acc.push(abs_path);
        });
        return acc
    }

    const githubInterface = new GithubInterface(process.env.github_token??'')

    const dirName = await githubInterface.DownloadRepository("https://github.com/i-voted-for-trump/is-odd")
    const { filenames, result } = await Parser.ParseFiles({ path: dirName })
    console.log(result.values())
})()

