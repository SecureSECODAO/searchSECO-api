import { Request, Response } from 'express'
import { GithubInterface } from '../searchseco/spider/GithubInterface'
import Parser from '../parser/Parser'
import { TCPClient } from '../searchseco/databaseAPI/Client'
import config from '../config/config'

export async function fetch(req: Request, res: Response): Promise<void> {
    try {
        const { url, token, address } = req.body

        const githubInterface = new GithubInterface(token)
        const dirName = await githubInterface.DownloadRepository(url)

        if (!dirName)
            throw new Error("Cannot find repository.")

        const { filenames, result } = await Parser.ParseFiles({ path: dirName })

        await GithubInterface.ClearCache(dirName)

        res.status(200).json(result)
    }
    catch (e: any) {
        console.log(e)
        res.status(e.status || 500).json(e)
    }
}

export async function check(req: Request, res: Response): Promise<void> {
    const { hashes } = req.body

    const tcpClient = new TCPClient('dao', config.DB_PORT || 8003, config.DB_HOST || '127.0.0.1')
    const [ methodData, authorData, projectData ] = (await tcpClient.Check(hashes)).map(res => res.response)

    // sanitize email
    authorData.forEach((author: any) => author.email = author.email.replace(/<|>/g, ''))

    const formatted = { 
        methodData,
        authorData,
        projectData
    }

    res.status(200).json(formatted)
}
