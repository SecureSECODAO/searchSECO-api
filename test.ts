import Parser from './src/parser/parser.ts'
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

    const { filenames, result } = await Parser.ParseFiles({ path: test_dir })
    console.log(result.values())
})()

