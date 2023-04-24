import express from 'express'
import bodyParser from 'body-parser';
import { GithubInterface, sleep } from './src/GithubInterface.ts';
import { TCPClient } from './src/databaseAPI/client.ts';
import Parser from './src/parser/parser.ts';
import fs from 'fs'
import { RequestType } from './src/databaseAPI/request.ts';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/fetch', async (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json')
    try {
        const { url, token } = req.body

        const githubInterface = new GithubInterface(token)
        const dirName = await githubInterface.DownloadRepository(url)

        console.log(dirName)

        if (!dirName)
            throw new Error("Cannot find repository.")

        const { filenames, result } = await Parser.ParseFiles({ path: dirName })

        let zip_removed = false
        let dir_removed = false

        fs.unlink(`./.temp/${dirName}.zip`, (err) => {
            if (err) throw err
            zip_removed = true
        })

        fs.rm(`./.temp/${dirName}`, { recursive: true, force: true }, (err) => {
            if (err) throw err
            dir_removed = true
        })

        while (!zip_removed && dir_removed)
            await sleep(500)

        res.end(JSON.stringify(Object.fromEntries(result)))

    }
    catch (e: any) {
        res.status(e.status ?? 500)
        res.json(e).end()
    }
})

app.post('/check', async (req, res) => {
    const { hashes } = req.body

    const tcpClient = new TCPClient('dao', parseInt(process.env.db_port??'8003'), process.env.db_host??'127.0.0.1')
    const response = await tcpClient.Fetch(RequestType.CHECK, hashes)
    res.end(JSON.stringify(response))
})

const server = app.listen({ port: 8080 })

const addr = server.address();
const binding = typeof addr === 'string'
    ? `pipe/socket ${addr}`
    : `port ${addr?.port}`;
console.log(`🚀 Server listening on ${binding}`);