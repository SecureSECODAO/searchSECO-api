import express from 'express'
import logger from 'morgan'
import * as path from 'path'

import { errorHandler, errorNotFoundHandler } from './middleware/errorHandler'
import { api } from './routes/api'

import cors from "cors"

import { errors } from "celebrate"

export const app = express()

app.use(express.json())
app.use(cors())
app.use(logger("dev"))

app.set("port", process.env.PORT || 8080)

app.use("/api", api)

app.use(errors())
app.use(errorNotFoundHandler)
app.use(errorHandler)

