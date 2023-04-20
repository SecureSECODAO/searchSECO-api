import HashData from "../../utils/HashData";
import { ParserBase } from "../parserBase.ts";

export default class Python extends ParserBase {
    protected override parseSingle(data: string): HashData[] {
        return []
    }
}
