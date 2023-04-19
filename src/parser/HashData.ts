

class HashData {
    public readonly Hash: string
    public readonly FileName: string
    public readonly FunctionName: string
    public readonly LineNumber: number
    public readonly LineNumberEnd: number

    constructor(
        hash: string,
        fileName: string,
        functionName: string,
        lineNumber: number,
        lineNumberEnd: number
     ) {
        this.Hash = hash
        this.FileName = fileName
        this.FunctionName = functionName
        this.LineNumber = lineNumber
        this.LineNumberEnd = lineNumberEnd
     }
}

export default HashData