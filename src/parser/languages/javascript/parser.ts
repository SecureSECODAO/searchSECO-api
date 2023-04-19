import HashData from "../../HashData.ts";
import { ParserBase } from "../parserBase.ts";
import antlr4 from 'antlr4';
import { default as ant } from 'antlr4'
import JavaScriptLexer from "./lib/JavaScriptLexer.js";
import JavaScriptParser from "./lib/JavaScriptParser.js"
import JSListener from "./lib/JavaScriptParserListenerDerived.js";


export default class Javascript extends ParserBase {
    protected override parseSingle(data: string): HashData {
        const chars = new antlr4.InputStream(data)
        const lexer = new JavaScriptLexer(chars)
        const parser = new JavaScriptParser(new antlr4.CommonTokenStream(lexer))

        parser.buildParseTrees = true

        const tree = parser.program()
        const listener = new JSListener()


        antlr4.ParseTreeWalker.DEFAULT.walk(listener, tree)


        return new HashData('js', '', '', 0, 0)
    }
}

