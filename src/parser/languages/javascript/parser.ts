import HashData from "../../utils/HashData";
import { ParserBase } from "../parserBase.ts";
import antlr4 from 'antlr4';
import JavaScriptLexer from "./lib/JavaScriptLexer.js";
import JavaScriptParser from "./lib/JavaScriptParser.js"
import JSListener from "./lib/JavaScriptParserListenerDerived.js";
import TokenStreamRewriter from "../../utils/TokenStreamRewriter.ts";


export default class Javascript extends ParserBase {
    protected override parseSingle(data: string, filename: string): HashData[] {
        const chars = new antlr4.InputStream(data)
        const lexer = new JavaScriptLexer(chars)
        const tokens = new antlr4.CommonTokenStream(lexer)
        tokens.fill()

        const parser = new JavaScriptParser(tokens)
        const rewriter = new TokenStreamRewriter(parser.getTokenStream())

        parser.buildParseTrees = true

        const tree = parser.program()
        const listener = new JSListener(rewriter, filename)

        antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree)

        const output: HashData[] = listener.GetData()

        console.log(output)
        //console.log(output)

        return output
    }
}

