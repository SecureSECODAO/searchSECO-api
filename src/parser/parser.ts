import HashData from "./utils/HashData";
import { IParser } from "./languages/parserBase.ts";
import Javascript from "./languages/javascript/parser.ts";
import Python from "./languages/python/parser.ts";
import * as fs from 'fs'
import path from 'path'

enum Language {
    PYTHON = 1,
    JS
}

function getFiles(dir: string, acc: string[] = []): string[] {
    fs.readdirSync(dir).forEach((file: string) => {
        const abs_path = path.join(dir, file);
        if (fs.statSync(abs_path).isDirectory()) return getFiles(abs_path, acc);
        else acc.push(abs_path);
    });
    return acc
}

export default class Parser {
    static parsers: Map<Language, IParser> = new Map<Language, IParser>([
        [Language.JS, new Javascript()],
        [Language.PYTHON, new Python()]
    ]);


    public static async ParseFiles({path, files}: {path?: string, files?: string[]}): Promise<Map<string, HashData[]>> {
        if (!files) files = getFiles(path??'')
        let result = new Map<string, HashData[]>()
        files.forEach(file => {
            const { filename, lang } = Parser.getFileName(file) ?? { filename: "" }
            if (!lang)
                return

            const content = fs.readFileSync(file, 'utf-8')
            const parser = Parser.parsers.get(lang)
            if (!parser)
                return

            parser.AddFile(content, filename)
        })

        await Promise.all([...this.parsers.values()].map(async p => {
            const content = await p.Parse()
            result = new Map([...result, ...content])
        }))
    
        return result
    }

    private static getFileName(filepath: string): {filename: string, lang: Language} | undefined {
        const filename = filepath.split('\\').pop()?.split('/').pop();

        switch (filename?.split('.').pop()) {
            case "py": return {filename, lang: Language.PYTHON} 
            case "js": return {filename, lang: Language.JS} 
            default: return undefined
        }
    }
}