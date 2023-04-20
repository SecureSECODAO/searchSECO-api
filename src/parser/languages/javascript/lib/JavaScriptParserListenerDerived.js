import JavaScriptParserListener from "./JavaScriptParserListener.js";
import md5 from 'md5'
import HashData from "../../../utils/HashData.ts";
import TokenStreamRewriter from "../../../utils/TokenStreamRewriter.ts";
import antlr4 from "antlr4";

export default class JSListener extends JavaScriptParserListener {
    constructor(tsr, filename, minMethodSize, minFunctionChars) {
        super()

        this.minMethodSize = minMethodSize ?? 0
        this.minFunctionChars = minFunctionChars ?? 0

        this.baseTSR = tsr
        this.filename = filename
        this.output = []
        this.starts = []
        this.tsrs = []
        this.functionNames = []
        this.functionBodies = []
        this.stop = 0

        this.inNonAbsoluteFunctionDef = true
    }

    enterAnonymousFunctionDecl(ctx) {
        this.tsrs.push(new TokenStreamRewriter(this.baseTSR.GetTokenStream()))
        this.starts.push(ctx.start.line)

        this.functionBodies.push("")
        this.functionNames.push("")

        this.inNonAbsoluteFunctionDef = false
    }

    exitAnonymousFunctionDecl(ctx) {
        const functionName = this.functionNames.pop()
        const functionBody = this.functionBodies.pop().replace(/\s+/, '')

        const start = this.starts.pop()
        const stop = ctx.stop.line

        if (stop - start >= this.minMethodSize)
            this.output.push(new HashData(md5(functionBody), this.filename, functionName, start, stop))

        this.tsrs.pop()
        // if (this.tsrs.length > 0) {
        //     this.tsrs[this.tsrs.length-1].Replace(ctx.start.tokenIndex, ctx.stop.tokenIndex, "var")
        // }
    }

    enterFunctionDeclaration(ctx) {
        this.tsrs.push(new TokenStreamRewriter(this.baseTSR.GetTokenStream()))
        this.starts.push(ctx.start.line)

        this.functionBodies.push("")
        this.functionNames.push("")

        this.inNonAbsoluteFunctionDef = true
    }

    exitFunctionDeclaration(ctx) {
        const functionName = this.functionNames.pop()
        const functionBody = this.functionBodies.pop().replace(/\s+/gm, '')

        const start = this.starts.pop()
        const stop = ctx.stop.line

        if (stop - start >= this.minMethodSize) {
            const hashData = new HashData(md5(functionBody), functionName, this.filename, start, stop)
            this.output.push(hashData)
        }

        this.tsrs.pop()
        if (this.tsrs.length > 0) {
            this.tsrs[this.tsrs.length-1].Replace(ctx.start.tokenIndex, ctx.stop.tokenIndex)
        }
    }

    enterFunctionBody(ctx) {
        this.inNonAbsoluteFunctionDef = false
    }

    exitFunctionBody(ctx) {
        this.functionBodies.pop()
        this.functionBodies.push(this.tsrs[this.tsrs.length-1].GetText(new antlr4.Interval(ctx.start.tokenIndex, ctx.stop.tokenIndex)))
    }

    enterIdentifier(ctx) {
        const name = this.functionNames.pop()
        if (this.inNonAbsoluteFunctionDef && name === "") {
            this.functionNames.push(ctx.getText())
            return
        }

        if (name !== "")
            this.functionNames.push(name)
        
        // if (this.tsrs.length > 0) {
        //     this.tsrs[this.tsrs.length-1].Replace(ctx.start, ctx.start, "var")
        // } 
    }

    visitTerminal(ctx) {

    }

    visitErrorNode(ctx) {

    }

    enterEveryRule(ctx) {

    }

    exitEveryRule(ctx) {

    }

    GetData() {
        return this.output
    }

}