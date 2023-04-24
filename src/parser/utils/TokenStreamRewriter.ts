import antlr4 from 'antlr4'

/**
 * Use this class as a substitute for antlr4.TokenStreamRewriter.
 * As of version 4.12, antlr4 does not support a JS implementation if TokenStreamRewriter,
 * so this is a bare-bone port of the Java implementation.
 */
export default class TokenStreamRewriter {
    static DEFAULT_PROGRAM_NAME: string = "default"
    static PROGRAM_INIT_SIZE: number = 100;
    static  MIN_TOKEN_INDEX: number = 0;

    protected tokens: antlr4.TokenStream
    protected programs: Map<string, RewriteOperation[]>
    protected lastRewriteTokenIndexes: Map<string, number>

    constructor(tokens: antlr4.TokenStream) {
        this.tokens = tokens

        this.programs = new Map<string, RewriteOperation[]>()
        this.programs.set(TokenStreamRewriter.DEFAULT_PROGRAM_NAME,
            new Array<RewriteOperation>())
        this.lastRewriteTokenIndexes = new Map<string, number>()
    }

    public GetTokenStream(): antlr4.TokenStream {
        return this.tokens
    }

    public Replace(from: number, to: number, text: string) {
        if (from > to || from < 0 || to < 0 || to > this.tokens.size())
            throw new Error(`replace: range invalid:  ${from}..${to} (${this.tokens.size()})`)
        const rewrites = this.getProgram(TokenStreamRewriter.DEFAULT_PROGRAM_NAME)
        if (rewrites) {
            const op = new ReplaceOp(from, to, text)
            op.SetInstructionIndex(rewrites.length)
            rewrites.push(op)
        }   
    }

    public GetText(interval: antlr4.Interval, debug?: boolean): string {
        const rewrites = this.getProgram(TokenStreamRewriter.DEFAULT_PROGRAM_NAME)

        let start = interval.start
        let stop = interval.stop

        if (!rewrites || rewrites.length == 0) {
            return this.tokens.getText(interval)
        }
            
        let buf = [] as string[]
        let i = start
        while (i <= stop && i < this.tokens.size()) {
            const op = rewrites[i]
            rewrites.slice(i,i)
            const token = this.tokens.get(i)
            if (!op) {
                if (token.type != antlr4.Token.EOF) 
                    buf.push(token.text)
                i++
            }
            else i = op.execute(buf)
        }

        if (stop == this.tokens.size() - 1) {
            rewrites.forEach(op => {
                if (op.index >= this.tokens.size() - 1)
                    buf.push(op.text)
            })
        }

        return buf.join('')
    }

    private getProgram(prog: string): RewriteOperation[] | undefined {
        return this.programs.get(prog)
    }
}

abstract class RewriteOperation {
    /** What index into rewrites List are we? */
    protected instructionIndex: number = 0
    /** Token buffer index. */
    public index: number;
    public text: string = "";

    constructor(index: number, text?: string) {
        this.index = index;
        if (text)
            this.text = text
    }
    /** Execute the rewrite operation by possibly adding to the buffer.
     *  Return the index of the next token to operate on.
     */
    public abstract execute(buf: string[]): number; // {
    //     return this.index;
    // }

    public SetInstructionIndex(idx: number) {
        this.instructionIndex = idx
    }
}

class ReplaceOp extends RewriteOperation {
    protected lastIndex: number;

    constructor(from: number, to: number, text: string) {
        super(from, text);
        this.lastIndex = to;
    }

    public override execute(buf: string[]) {
        if ( this.text ) {
            buf.push(this.text);
        }
        return this.lastIndex + 1;
    }
}
