import HashData from "../../HashData.ts";
import { ParserBase } from "../ParserBase.ts";
import antlr4ts from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker.js'
import { JavaScriptLexer } from "./lib/JavaScriptLexer.ts";
import { JavaScriptParser } from "./lib/JavaScriptParser.ts"
import JSListener from "./lib/JavaScriptParserListenerDerived.ts";


/**
 * The implementation of a Javascript parser. This parser inherits from `ParserBase`.
 */
export default class Javascript extends ParserBase {
    protected override parseSingle(data: string, filename: string): HashData[] {
        const chars = new antlr4ts.ANTLRInputStream(data)
        const lexer = new JavaScriptLexer(chars)
        const tokens = new antlr4ts.CommonTokenStream(lexer)
        tokens.fill()

        const parser = new JavaScriptParser(tokens)
        const rewriter = new antlr4ts.TokenStreamRewriter(tokens)

        parser.buildParseTree = true

        const tree = parser.program()
        const listener = new JSListener(rewriter, filename, 0, 0)

        ParseTreeWalker.DEFAULT.walk(listener, tree)

        return listener.GetData()
    }
}

