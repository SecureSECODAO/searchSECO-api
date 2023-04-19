import JavaScriptParserListener from "./JavaScriptParserListener.js";

export default class JSListener extends JavaScriptParserListener {
    enterFunctionDeclaration(ctx) {
        console.log("decl", ctx)
    }

    enterFunctionBody(ctx) {
        console.log("body", ctx)
    }

    visitTerminal(ctx) {
        console.log("Terminal")
    }

    visitErrorNode(ctx) {
        console.log("Error node", ctx)
    }

    enterEveryRule(ctx) {
        console.log("Enter every rule", ctx)
    }

    exitEveryRule(ctx) {
        console.log("Exit every rule", ctx)
    }

}