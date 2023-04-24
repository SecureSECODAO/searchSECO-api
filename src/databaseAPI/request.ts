export enum RequestType {
    UPLOAD = 'upld',
    CHECK = 'chck',
    CHECK_UPLOAD = 'chup',
    CONNECT = 'conn',
    GET_IPS = 'gtip',
    UPLOAD_JOB = 'upjb',
    UPLOAD_CRAWL_DATA = 'upcd',
    GET_TOP_JOB = 'gtjb',
    UPDATE_JOB = 'udjb',
    FINISH_JOB = 'fnjb',
    EXTRACT_PROJECTS = 'extp',
    GET_AUTHOR = 'idau',
    GET_METHOD_BY_NAME = 'aume',
    GET_PREVIOUS_PROJECT = 'gppr',
    UNDEFINED = 'undf'
}

export type TCPRequest = {
    type: RequestType,
    body: string[]
}

export interface IRequestGenerator {
    Generate(type: RequestType, clientName: string, raw: string[]): TCPRequest
}

export class CheckRequestGenerator implements IRequestGenerator {
    public Generate(type: RequestType, clientName: string, raw: string[]): TCPRequest {
        const dataLength = raw.reduce((prev, curr) => prev + `${curr}\n`.length, 0)
        const requests =
            [`${type}?${clientName}?${dataLength}\n`, raw.reduce((prev, curr) => prev + `${curr}\n`, "")]
        return {
            type,
            body: requests
        }
    }
}

export class RequestFactory {
    static GetRequestGenerator(type: RequestType): IRequestGenerator {
        switch (type) {
            case RequestType.CHECK: return new CheckRequestGenerator()
            default: throw new Error(`Request generator not implemted for id ${type}`)
        }
    }
}
