import path from "path";
import dotenv from 'dotenv'

dotenv.config({ path: path.join(__dirname, "../config/.env") });

interface ENV {
    DB_PORT: string | number | undefined;
    DB_HOST: string | undefined;
    PORT: string | number | undefined;
    HOST: string | undefined;
}

interface Config {
    DB_PORT: string | number | undefined;
    DB_HOST: string | undefined;
    PORT: string | number | undefined;
    HOST: string | undefined;
}

function getConfig(): ENV {
    return {
        DB_PORT: process.env.DB_PORT,
        DB_HOST: process.env.DB_HOST,
        PORT: process.env.PORT,
        HOST: process.env.HOST
    }
}

function getSanitizedConfig(config: ENV): Config {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined)
            throw new Error(`Missing key ${key} in .env`)
    }
    return config as Config
}

const config = getConfig()
const sanitizedConfig = getSanitizedConfig(config)

export default sanitizedConfig