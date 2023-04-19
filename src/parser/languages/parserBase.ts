import HashData from "../HashData"

interface IParser {
    Parse(): Promise<HashData[]>
    AddFile(data: string): void
}

abstract class ParserBase implements IParser {
    protected readonly files: string[] = []

    public AddFile(data: string): void {
        this.files.push(data)
    }

    protected abstract parseSingle(data: string): HashData;

    public async Parse(): Promise<HashData[]> {
        return Promise.resolve().then(async () => {
            const result = []
            while (this.files.length > 0) {
                const data = this.files.pop() ?? ""
                result.push(this.parseSingle(data))
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