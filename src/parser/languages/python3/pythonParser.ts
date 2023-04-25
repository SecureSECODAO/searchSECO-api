import HashData from "../../HashData.ts";
import { ParserBase } from "../parserBase.ts";
import antlr4ts from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker.js'
import { Python3Lexer } from "./lib/Python3Lexer.ts";
import { Python3Parser } from "./lib/Python3Parser.ts"
import Python3Listener from "./lib/Python3ListenerDerived.ts";

/**
 * The implementation of a Python3 parser. This parser inherits from `ParserBase`.
 */
export default class Python extends ParserBase {
    protected override parseSingle(data: string, filename: string): HashData[] {
        const chars = new antlr4ts.ANTLRInputStream(data)
        const lexer = new Python3Lexer(chars)
        const tokens = new antlr4ts.CommonTokenStream(lexer)
        tokens.fill()

        const parser = new Python3Parser(tokens)
        const rewriter = new antlr4ts.TokenStreamRewriter(tokens)

        parser.buildParseTree = true

        const tree = parser.file_input()

        const listener = new Python3Listener(rewriter, filename, 0, 0)

        ParseTreeWalker.DEFAULT.walk(listener, tree)

        return listener.GetData()
    }
}

