import HashData from "../utils/HashData"

interface IParser {
    Parse(): Promise<Map<string, HashData[]>>
    AddFile(data: string, filename: string): void
}

abstract class ParserBase implements IParser {
    protected readonly files: { filename: string, data: string}[] = []

    public AddFile(data: string, filename: string): void {
        this.files.push({filename, data})
    }

    protected abstract parseSingle(data: string, filename: string): HashData[];

    public async Parse(): Promise<Map<string, HashData[]>> {
        const result = new Map<string, HashData[]>()

        return Promise.resolve().then(async () => {
            while (this.files.length > 0) {
                const {filename, data} = this.files.pop() ?? { filename: "", data: "" }
                result.set(filename, this.parseSingle(data, filename))
            }
            this.reset()
            return result
        })
    }

    private reset(): void {
        this.files.length = 0
    }
}

export {
    IParser,
    ParserBase
}