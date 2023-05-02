import { RequestType } from "../databaseAPI/Request"

export enum Command {
    CHECK = 'chck',
    UPLOAD = 'upld',
    CHECK_UPLOAD = 'chup',
}

/**
 * Maps the request type to a series of API requests
 * @param type The request type to be mapped to an array
 * @returns 
 */
export function RequestMapping(cmd: Command): RequestType[] {
    switch (cmd) {
        case Command.CHECK: return [
            RequestType.CHECK,
            RequestType.GET_AUTHOR,
            RequestType.EXTRACT_PROJECTS
        ]
        default: return []
    }
}