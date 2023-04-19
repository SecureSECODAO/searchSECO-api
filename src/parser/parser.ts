import HashData from "./HashData.ts";
import { IParser } from "./languages/parserBase.ts";
import Javascript from "./languages/javascript/parser.ts";
import Python from "./languages/python/parser.ts";
import * as fs from 'fs'
import path from 'path'

enum Language {
    PYTHON = 1,
    JS
}

export default class Parser {
    static parsers: Map<Language, IParser> = new Map<Language, IParser>([
        [Language.JS, new Javascript()],
        [Language.PYTHON, new Python()]
    ]);

    public static async ParseFiles(files: string[]): Promise<HashData[]> {
        const result = [] as HashData[]
        files.forEach(file => {
            const lang = Parser.getLanguage(file)
            if (!lang)
                return

            const content = fs.readFileSync(file, 'utf-8')
            const parser = Parser.parsers.get(lang)
            if (!parser)
                return

            parser.AddFile(content)
        })

        await Promise.all([...this.parsers.values()].map(async p => {
            const data = await p.Parse()
            result.push(...data)
        }))
    
        return result
    }

    private static getLanguage(filepath: string): Language | undefined {
        switch (filepath.split('.').pop()) {
            case "py": return Language.PYTHON
            case "js": return Language.JS
            default: return undefined
        }
    }
}