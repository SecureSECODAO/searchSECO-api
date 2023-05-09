import HashData from "../../utils/HashData";
import { IParser } from "./ParserBase";
import Javascript from "./languages/javascript/JavascriptParser";
import Python from "./languages/python3/PythonParser";
import CPP from './languages/cpp/CPPParser'
import * as fs from 'fs'
import path from 'path'
import XMLParser from "./srcML/XmlParser";

const storageDir = '.tmp'

export enum XMLSupportedLanguage {
    CPP = "C++",
    CSHARP = "C#",
    JAVA = "Java"
}

export enum ANTLRSupportedLanguage {
    PYTHON = "Python",
    JS = "Javascript",
}

const Language = { ...XMLSupportedLanguage, ...ANTLRSupportedLanguage }
export type Language = XMLSupportedLanguage | ANTLRSupportedLanguage

/** 
 * Recursively retrieves file paths from all nested subdirectories in a root dir.
 * @param dir The root dir to list files from
 * @returns A list of all file paths found. The paths are relative to the specified dir.
 */
function getFiles(dir: string): string[] {
    function recursivelyGetFiles(currDir: string, acc: string[]): string[] {
        fs.readdirSync(currDir).forEach((file: string) => {
            const abs_path = path.join(currDir, file);
            if (fs.statSync(abs_path).isDirectory()) return recursivelyGetFiles(abs_path, acc);
            else acc.push(abs_path);
        });
        return acc
    }

    return recursivelyGetFiles(dir, [])
}

/** 
 * Extracts the filename and language from a given file path
 * @param filepath The path to extract the filename and language from.
 * @returns A tuple containing the filename and the language. If the language is not supported, undefined is returned.
 */
function getFileNameAndLanguage(filepath: string): {filename: string, lang: Language | undefined} {
    const filename = filepath.split('\\').pop()
    switch (filename?.split('.').pop()?.toLowerCase()) {
        case "py": return { filename, lang: Language.PYTHON } 
        case "js": return { filename, lang: Language.JS }
        case "cpp": return { filename, lang: Language.CPP }
        case "csharp": return { filename, lang: Language.CSHARP }
        case "java": return { filename, lang: Language.JAVA }
        default: return {filename: filename || '', lang: undefined}
    }
}

/**
 * The Javascript implementation of the SearchSECO parser. 
 * This parser is a static class that holds references to the individual language parsers.
 */
export default class Parser {
    static parsers: Map<Language, IParser> = new Map<Language, IParser>([
        [Language.JS, new Javascript()],
        [Language.PYTHON, new Python()],
        [Language.CPP, new CPP()],
        [Language.CSHARP, new XMLParser(Language.CSHARP)],
        [Language.JAVA, new XMLParser(Language.JAVA)]
    ]);

    /** 
     * Parses a list of files or a whole directory based on a path. This method is static.
     * @param path The optional path of the directory to parse all files from
     * @param files The optional list of file paths to parse. If this list is not defined, the path parameter has to be set.
     * @returns A tuple containing the list of filenames parsed, and a Map. The keys of this map are the file names, 
     * and the values are HashData objects containing data about the parsed functions.
     */
    public static async ParseFiles({path, files}: {path?: string, files?: string[]}): Promise<{filenames: string[], result: HashData[]}> {
        files ??= getFiles(`${storageDir}/${path}`)
        const filenames: string[] = []
        let result: HashData[] = []
        files.forEach(file => {
            const { filename, lang } = getFileNameAndLanguage(file)
            if (!lang)
                return

            filenames.push(filename)
            const content = fs.readFileSync(file, 'utf-8')
            const parser = Parser.parsers.get(lang)
            if (!parser)
                return

            parser.AddFile(filename, file, content)
        })

        await Promise.all([...this.parsers.values()].map(async (p: IParser) => {
            const content = await p.Parse()
            result.push(...content)
        }))
    
        return { filenames, result }
    }
}
