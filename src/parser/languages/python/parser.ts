import HashData from "../../HashData.ts";
import { ParserBase } from "../parserBase.ts";

export default class Python extends ParserBase {
    protected override parseSingle(data: string): HashData {
        return new HashData('py', '', '', 0, 0)
    }
}
