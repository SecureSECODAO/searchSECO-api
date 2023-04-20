import express from 'express'
import bodyParser from 'body-parser';
import GithubInterface from './src/GithubInterface';
import winston from 'winston'
import expressWinston from 'express-winston'

const githubInterface = new GithubInterface(process.env.github_token??'')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));
app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
}));

app.get('/crawler', async (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json')
    try {
        let url = req.query.url

        console.log(url)

        const { login, name, ref } = await githubInterface.DownloadRepository(url) ?? {}

        res.json({login: login, name: name, ref: ref}).end()
    }
    catch (e: any) {
        res.status(e.status)
        res.json(e).end()
    }
})

const server = app.listen({ port: 8080 })

const addr = server.address();
const binding = typeof addr === 'string'
    ? `pipe/socket ${addr}`
    : `port ${addr?.port}`;
console.log(`🚀 Server listening on ${binding}`);