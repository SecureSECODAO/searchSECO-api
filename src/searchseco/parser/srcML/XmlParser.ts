import md5 from "md5";
import HashData from "../../../utils/HashData";
import { Language } from "../Parser";
import { ParserBase } from "../ParserBase";
import { execSync } from 'child_process'
import { Parser} from 'xml2js'
import { Node, TagData } from './Node'
import StringStream from "./StringStream";


export default class XMLParser extends ParserBase {
    private readonly _language: Language
    private inFunction: boolean = false
    private _parseFurther: boolean = true
    private _current: Node
    private _tree: Node

    constructor(lang: Language) {
        super(true)
        this._language = lang
    }

    private getNextTag(stream: StringStream): TagData {
        const textBefore = stream.GetDataUntil([ '<' ], true).output
        let textIn = ''
        const { output: tag, brokeOn } = stream.GetDataUntil([ ' ', '>' ], false)
        if (brokeOn === ' ') {
            textIn = stream.GetDataUntil([ '>' ], false).output
        }
        return new TagData(tag, textBefore, textIn)
    }

    private handleClosingTag(tagData: TagData) {
        if (tagData.tag.substring(1) !== this._current.GetTag()) {
            delete this._tree
            this._tree = new Node("unknown")
            this._current = this._tree
            this.inFunction = false
            return
        }

        const prev = this._current.GetPrevious()
        if (this._current.GetTag() === "function" && this._parseFurther) {
            
        }
    }

    private handleOpeningTag(tagData: TagData) {
        if (this._current.GetTag() !== "function" && !inFunction) {
            if (tagData.tag === "unit")
                
        }
    }

    private ParseXMLStream(input: string): HashData[] {
		const stream = new StringStream(input)
        const hashes: HashData[] = []

        this._tree = new Node("unknown")
        const firstTag = this.getNextTag(stream)
        if (stream.Empty() && firstTag.tag === "")
            return
		if (firstTag.tag !== "?xml") {
            this._tree = undefined
			return []
        }

		let inFunction = false
		this._current = this._tree

		while (!stream.Empty()) {
			const tagData = this.getNextTag(stream)
			if (tagData.textBefore !== "" && inFunction)
				this._current.AddNode(new Node(tagData.textBefore, this._current.GetTag(), this._current))

			if (tagData.tag[0] === "/" && inFunction)
                this.handleClosingTag(tagData)

			else if (tagData.tag.substring(0,7) === "comment")
				while (this.getNextTag(stream).tag !== "/comment") {}
			else {
                this.handleOpeningTag(tagData)
			}
		}
    }

    private async parseToXML(path: string): Promise<string> {
        const cmd = `srcml ${path} -l ${this._language}`
        try {
            const stdout = execSync(cmd)
            return stdout.toString()
        }
        catch (err) {
            console.log(err.toString())
        }
    }

    protected async parseSingle(data: string, filename: string): Promise<HashData[]> {
        const result: HashData[] = []
        const parsed = await this.parseToXML(filename)

        // console.log(JSON.stringify(parsed))

        const collapsed = this.collapse(parsed)
        console.log(collapsed)

        // parsed.unit.function.forEach((func: any) => {
        //     const hash = new HashData()
        //     hash.FileName = filename.split('\\').pop()
        //     hash.FunctionName = func.name[0]
        //     hash.Hash = md5(collapse(func.block[0].block_content))
        //     result.push(hash)
        //     console.log(collapse(func.block[0].block_content, ""))
        // })
        // console.log(result)

        return result
    }
}