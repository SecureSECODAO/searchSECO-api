import express from 'express'
import bodyParser from 'body-parser';
import GithubInterface from './src/GithubInterface.ts';
import Parser from './src/parser/parser.ts';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/check', async (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json')
    try {
        const { url, token } = req.body

        const githubInterface = new GithubInterface(token)

        const path = await githubInterface.DownloadRepository(url)
        if (!path)
            throw new Error("Cannot find repository.")

        const result = await Parser.ParseFiles(path)
        
        res.json(result).end()

    }
    catch (e: any) {
        res.status(e.status ?? 500)
        res.json(e).end()
    }
})

const server = app.listen({ port: 8080 })

const addr = server.address();
const binding = typeof addr === 'string'
    ? `pipe/socket ${addr}`
    : `port ${addr?.port}`;
console.log(`🚀 Server listening on ${binding}`);