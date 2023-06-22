/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * � Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import logger from "morgan";
import * as path from "path";

import { errorHandler, errorNotFoundHandler } from "./middleware/errorHandler";

import cors from "cors";

import { errors } from "celebrate";

import cassandra from "cassandra-driver";
import config from "./config/config";

console.log(`🌎 Environment: ${process.env.NODE_ENV}`);
console.log(`📜 Contract address: ${config.DAO_CONTRACT_ADDRESS}`);

export const dbClient = new cassandra.Client({
    contactPoints: [`${config.DB_HOST}:8002`],
    localDataCenter: "dcscience-vs317.science.uu.nl",
    authProvider: new cassandra.auth.PlainTextAuthProvider(
        "cassandra",
        "cassandra"
    ),
    keyspace: "rewarding",
});

dbClient.connect().then(() => {
    console.log("🛢  Connected to Cassandra DB");
});

import { api } from "./routes/api";

export const app = express();

app.use(express.json());
app.use(cors());
app.use(logger("dev"));

app.set("port", process.env.PORT || 8080);

app.use("/api", api);

app.use(errors());
app.use(errorNotFoundHandler);
app.use(errorHandler);
