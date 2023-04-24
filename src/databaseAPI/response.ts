import { RequestType } from './request.ts'

export type ResponseData = {}
export type CheckResponseData = ResponseData & {
    method_hash?: string,
    projectID?: string,
    startVersion?: string,
    startVersionHash?: string,
    endVersion?: string,
    endVersionHash?: string,
    method_name?: string,
    file?: string,
    lineNumber?: string,
    parserVersion?: string,
    vulnCode?: string,
    authorTotal?: string,
    authorIds?: any
}

export type TCPResponse = {
    responseCode: number,
    requestType: RequestType | undefined,
    response: ResponseData[]
} | undefined

export interface IResponseDecoder {
    Decode(raw: string[]): ResponseData[]
}

export class TCPCheckResponseDecoder implements IResponseDecoder {
    public Decode(raw: string[]): ResponseData[] {

        if (raw.includes('No results found.'))
            return []

        const decoded = [] as ResponseData[]

        raw.forEach(method => {
            const methodMetadata = this._makeResponseObject()
            const rawMetadata = method.split('?')
            Object.keys(methodMetadata).forEach((key, idx) => {
                methodMetadata[key as keyof CheckResponseData] = rawMetadata[idx]
            })
            methodMetadata.authorIds = methodMetadata.authorIds.split(',')
            decoded.push(methodMetadata)
        })
        return decoded
     }

     private _makeResponseObject(): CheckResponseData {
        return {
            method_hash: '',
            projectID: '',
            startVersion: '',
            startVersionHash: '',
            endVersion: '',
            endVersionHash: '',
            method_name: '',
            file: '',
            lineNumber: '',
            parserVersion: '',
            vulnCode: '',
            authorTotal: '',
            authorIds: [] as string[]
        }
     }
}

export class TCPUploadResponseDecoder  implements IResponseDecoder {
    Decode(): ResponseData[] {
        return [] as ResponseData[]
    }
}

 export class ResponseDecoderFactory {
    private static _responseDecoders: { type: RequestType, decoder: IResponseDecoder }[] = []
    public static GetDecoder(id: RequestType): IResponseDecoder {
        const decoder: IResponseDecoder | undefined = this._responseDecoders.find(p => p.type == id)?.decoder
        if (decoder)
            return decoder
        switch (id) {
            case RequestType.CHECK: 
                const newDecoder = new TCPCheckResponseDecoder()
                this._responseDecoders.push({ type: id, decoder: newDecoder })
                return newDecoder
            default: throw new Error(`unknown request type: ${id}`)
        }
    }
 }
