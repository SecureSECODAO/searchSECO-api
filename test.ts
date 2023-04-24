import Parser from './src/parser/parser.ts'
import antlr4 from 'antlr4';
import path from 'path';
import fs from 'fs';


(async () => {
    const files = ["./test/a.js"]
    const test_dir = './test/'
    
    function getFiles(dir: string, acc: string[] = []): string[] {
        fs.readdirSync(dir).forEach((file: string) => {
            const abs_path = path.join(dir, file);
            if (fs.statSync(abs_path).isDirectory()) return getFiles(abs_path, acc);
            else acc.push(abs_path);
        });
        return acc
    }

    const parsed = await Parser.ParseFiles({files})
    console.log(parsed.values())
})()

