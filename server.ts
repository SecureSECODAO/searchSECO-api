import express from 'express'
import bodyParser from 'body-parser';
import { GithubInterface } from './src/GithubInterface.ts';
import { TCPClient } from './src/databaseAPI/Client.ts';
import Parser from './src/parser/Parser.ts';
import { RequestType } from './src/databaseAPI/Request.ts';
import logger from 'morgan'
import j from 'joi';


// Validate the request body for the Fetch request.
// The body must contain a url, github token and a valid ETH wallet address. 
const fetchSchema = j.object().keys({
    body: j.object().keys({
        url: j.string().required(),
        token: j.string().required(),
        wallet: j.string().regex(/^0x[a-fA-F0-9]{40}$/)//.required()
    }).unknown().required()
}).unknown()

// Validate the request body for the Check request
// The body must contain an array of valid MD5 hashes and a valid ETH wallet address
const checkSchema = j.object().keys({
    body: j.object().keys({
        hashes: j.array().items(j.string().regex(/^[a-fA-F0-9]{32}$/i)).required(),
        wallet: j.string().regex(/^0x[a-fA-F0-9]{40}$/)//.required()
    }).unknown().required()
}).unknown()

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'))

app.post('/fetch', async (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json')
    try {
        const validated =  fetchSchema.validate(req)
        if (validated.error)
            throw validated.error
        
        const { body: { url, token, wallet } } = validated.value

        const githubInterface = new GithubInterface(token)
        const dirName = await githubInterface.DownloadRepository(url)

        if (!dirName)
            throw new Error("Cannot find repository.")

        const { filenames, result } = await Parser.ParseFiles({ path: dirName })

        await GithubInterface.ClearCache(dirName)

        res.end(JSON.stringify(Object.fromEntries(result)))

    }
    catch (e: any) {
        res.status(e.status || 500)
        res.end(JSON.stringify(e))
    }
})

app.post('/check', async (req, res) => {
    const validated = checkSchema.validate(req)
    if (validated.error)
        throw validated.error

    const { body: { hashes } } = validated.value

    const tcpClient = new TCPClient('dao', process.env.DB_PORT || 8003, process.env.DB_HOST || '127.0.0.1')
    const response = await tcpClient.Fetch(RequestType.CHECK, hashes)
    res.end(JSON.stringify(response))
})

const server = app.listen({ port: process.env.PORT || 8080 })

const addr = server.address();
const binding = typeof addr === 'string'
    ? `pipe/socket ${addr}`
    : `port ${addr?.port}`;
console.log(`🚀 Server listening on ${binding}`);