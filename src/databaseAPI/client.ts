import { Socket } from 'net'
import { ResponseDecoderFactory, TCPResponse } from './Response.ts'
import { RequestType, TCPRequest, RequestFactory } from './Request.ts'


/**
 * The TCP Client interface
 */
export interface ITCPClient {
    /**
     * Fetches a response from the database API. 
     * @param requestType The request type to fetch
     * @param data The data to be used when processing the request
     * @returns A promise which resolves to a `TCPResponse` when the request is handled.
     */
    Fetch(requestType: RequestType, data: string[]): Promise<TCPResponse>
}

export class TCPClient implements ITCPClient {
    private readonly _port: number = -1
    private readonly _host: string = ''
    private readonly _clientName: string
    private readonly _client: Socket
    private _request: TCPRequest | undefined = undefined
    private _requestProcessed: boolean = false
    private _busy: boolean = false
    private _response: TCPResponse = undefined
    private _error: any | undefined = undefined

    constructor(clientName: string, port: number | string, host: string) {
        this._clientName = clientName
        this._port = typeof(port) == 'number' ? port : parseInt(port)
        this._host = host

        this._client = new Socket()

        this._client.on('connect', () => {
            console.log(`Connected to ${this._host}:${this._port}`)
        })
        this._client.on('error', (err: any) => {
            this._error = err
        })
        this._client.on('data', (data: any) => {
            const [code, ...rawResponse] = data.toString().split('\n')
            const { type } = this._request || { type: RequestType.UNDEFINED }

            this._requestProcessed = true
            this._busy = false

            const decoder = ResponseDecoderFactory.GetDecoder(type)
            this._response = {
                responseCode: parseInt(code),
                requestType: type,
                response: decoder.Decode(rawResponse.filter((r: string) => r !== ''))
            }
            console.log("Done!")
            this._client.destroy()
        })
        this._client.on('close', () => {
            console.log('Connection closed')
        })
    }

    private _connect(): void {
        this._client.connect(this._port, this._host)
    }

    public async Fetch(type: RequestType, data: string[]): Promise<TCPResponse> {
        console.log(`Fetching ${data.length} items...`)

        while (this._busy)
            await new Promise(resolve => setTimeout(resolve, 500))
        this._busy = true
        this._connect()
        this._requestProcessed = false
        const requestGenerator = RequestFactory.GetRequestGenerator(type)
        this._request = requestGenerator.Generate(type, this._clientName, data)

        this._request.body.forEach(request => this._sendData(request))

        while (!this._requestProcessed) {
            await new Promise(resolve => setTimeout(resolve, 500))
        }
        if (this._error)
            throw this._error
        return this._response
    }

    private _sendData(request: string) {
        this._client.write(request)
    }
}
