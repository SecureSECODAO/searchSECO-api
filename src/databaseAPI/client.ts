import { Socket } from 'net'
import { ResponseDecoderFactory, TCPResponse } from './response.ts'
import { RequestType, TCPRequest, RequestFactory } from './request.ts'

export type Host = string
export type Port = number


export interface ITCPClient {
    Fetch(requestType: RequestType, data: string[]): Promise<TCPResponse>
}

export class TCPClient implements ITCPClient {
    private readonly _port: Port = -1
    private readonly _host: Host = ''
    private readonly _clientName: string
    private readonly _client: Socket
    private _request: TCPRequest | undefined = undefined
    private _requestProcessed: boolean = false
    private _busy: boolean = false
    private _response: TCPResponse = undefined
    private _error: Error | undefined = undefined

    constructor(clientName: string, port: Port, host: Host) {
        this._clientName = clientName
        this._port = port
        this._host = host

        this._client = new Socket()

        this._client.on('connect', () => {
            console.log(`Connected to ${this._host}:${this._port}`)
            console.log(`Local port: ${this._client.localPort}`)
        })
        this._client.on('error', (err: Error) => {
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