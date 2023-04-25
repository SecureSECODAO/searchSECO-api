import HashData from "../HashData"

/**
 * The interface each language parser must implement
 */
export interface IParser {
    /**
     * The files pending to be parsed.
     * @param filename stores the name of the file
     * @param data stores the string data contained in the file
     */
    readonly buffer: { filename: string, data: string}[]

    /**
     * Parses the files stored in the buffer.
     * @returns A promise which resolves to a Map containing the filenames and `HashData` objects
     */
    Parse(): Promise<Map<string, HashData[]>>

    /**
     * Adds a file to the `files` member variable
     * @param data The data to store
     * @param filename The filename to store
     */
    AddFile(data: string, filename: string): void
}

/** 
 * The parser base encapsulating common functionality between all language parsers.
 * Each language parser deriving from this base has to implement `parseSingle()` themselves.
 */
export abstract class ParserBase implements IParser {
    public readonly buffer: { filename: string, data: string}[] = []

    public AddFile(data: string, filename: string): void {
        this.buffer.push({filename, data})
    }

    /**
     * Parses a single file.
     * @param data The string data of the file
     * @param filename The filename
     * @returns a `HashData` array describing each method in the file.
     */
    protected abstract parseSingle(data: string, filename: string): HashData[];

    public async Parse(): Promise<Map<string, HashData[]>> {
        const result = new Map<string, HashData[]>()

        return Promise.resolve().then(async () => {
            while (this.buffer.length > 0) {
                const {filename, data} = this.buffer.pop() || { filename: "", data: "" }
                result.set(filename, this.parseSingle(data, filename))
            }
            // this.clear()
            return result
        })
    }

    /**
     * Clears the file buffer
     */
    private clear(): void {
        this.buffer.length = 0
    }
}
