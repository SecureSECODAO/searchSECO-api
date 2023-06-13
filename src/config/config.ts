/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../config/.env") });

interface ENV {
    NODE_ENV: string | undefined;
    DB_PORT: string | number | undefined;
    DB_HOST: string | undefined;
    PORT: string | number | undefined;
    HOST: string | undefined;
    DAO_CONTRACT_ADDRESS: `0x${string}` | undefined;
    PRIVATE_KEY: string | undefined;
    DEV_MNEMONIC: string | undefined;
}

interface Config {
    NODE_ENV: string | undefined;
    DB_PORT: string | number | undefined;
    DB_HOST: string | undefined;
    PORT: string | number | undefined;
    HOST: string | undefined;
    DAO_CONTRACT_ADDRESS: `0x${string}` | undefined;
    PRIVATE_KEY: string | undefined;
    DEV_MNEMONIC: string | undefined;
}

function getConfig(): ENV {
    return {
        NODE_ENV: process.env.NODE_ENV,
        DB_PORT: process.env.DB_PORT,
        DB_HOST: process.env.DB_HOST,
        PORT: process.env.PORT,
        HOST: process.env.HOST,
        DAO_CONTRACT_ADDRESS: process.env.DAO_CONTRACT_ADDRESS as `0x${string}`,
        PRIVATE_KEY: process.env.PRIVATE_KEY,
        DEV_MNEMONIC: process.env.DEV_MNEMONIC,
    };
}

function getSanitizedConfig(config: ENV): Config {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) throw new Error(`Missing key ${key} in .env`);
    }
    return config as Config;
}

const config = getConfig();
const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;
