import { celebrate, Joi } from "celebrate";
import { Router, Request, Response } from "express";
import * as controller from "../controllers/monetization";
import { v4 as uuidv4 } from "uuid";
import { createPublicClient, http } from "viem";
import { mainnet, goerli, polygonMumbai, polygon } from "viem/chains";
import { CronJob } from "cron";
import AsyncLock from "async-lock";
import config from "../config/config";
import { abi } from "../abi/monetization_abi";
import { check, checkHashes, fetchHashes } from "./api";
export const monetization = Router();

/**
 * Prevent different operations from interfering with each other
 */
const lock = new AsyncLock();

/**
 * Create a client so we can listen to events from the contract
 */
export const client = createPublicClient({
    chain: config.NODE_ENV === "production" ? polygon : polygonMumbai,
    transport: http(),
});

/**
 * Represents a session. A session is used to track the status of a payment / query.
 */
type SessionData = {
    secret: string;
    hashes: string[];
    timestamp: number;
    fetch_status: "idle" | "pending" | "success" | "error";
    data?: any;
};

/**
 * Stores the hashes for each session ID
 */
const sessions = new Map<string, SessionData>();

/**
 * GET /cost?url=...
 * Retrieves amount of hashes contained with the given GitHub repository.
 */
export const cost = async (req: Request, res: Response): Promise<void> => {
    const url = req.body.url as string;
    const token = req.body.token as string;

    try {
        // Get hash cost
        const data = await client.readContract({
            address: config.DAO_CONTRACT_ADDRESS,
            abi,
            functionName: "getHashCost",
        });

        let costPerHash = data as bigint;
        const hashes = await fetchHashes(url, token);

        let totalCost = costPerHash * BigInt(hashes.length);

        res.json({
            status: "ok",
            cost: Number(totalCost),
            hashes: hashes.map((h) => h.Hash),
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: "error",
            error: error.message,
        });
    }
};

/**
 * POST /startSession
 * Starts a new session, which later will store the data for the given hashes.
 */
export const startSession = async (
    req: Request,
    res: Response
): Promise<void> => {
    const hashes = req.body.hashes as string[];
    const sessId = uuidv4(); // Public
    const secret = uuidv4(); // Private

    await lock.acquire(`session_${sessId}`, () => {
        // Store the hashes for this session
        sessions.set(sessId, {
            hashes,
            timestamp: Date.now(),
            fetch_status: "idle",
            secret,
        });

        console.log(`Created session ${sessId}, num. hashes: ${hashes.length}`);
    });

    res.json({
        status: "ok",
        sessId,
        secret,
    });
};

/**
 * Watch for sessions that are paid, then handle them. The unwatch function
 * is used to stop watching for events.
 */
const unwatch = client.watchContractEvent({
    address: config.DAO_CONTRACT_ADDRESS as any,
    abi,
    eventName: "PaymentProcessed",
    onLogs: (logs) => {
        console.log(logs);
        for (const log of logs) {
            const sessId = (log.args as any).uniqueId;
            handlePaidSession(sessId);
        }
    },
});

/**
 * This function is called when a session is paid, and it will fetch the data
 * for the given hashes from the database API.
 * @param sessId Session ID to handle
 */
const handlePaidSession = async (sessId: string): Promise<void> => {
    await lock.acquire(`session_${sessId}`, async () => {
        const session = sessions.get(sessId);

        if (session) {
            console.log(
                `Session ${sessId} was paid, num. hashes: ${session.hashes.length}`
            );

            session.fetch_status = "pending";

            try {
                const response = await checkHashes(session.hashes);
                if (!response) throw new Error("No response from checkHashes");

                session.fetch_status = "success";
                session.data = response;

                sessions.delete(sessId);
                console.log(`Session ${sessId} data fetched`);
            } catch (error) {
                console.error(error);
                session.fetch_status = "error";
                return;
            }
        } else {
            console.log(`Session ${sessId} was paid, but no longer exists...`);
        }
    });
};

/**
 * GET /getData?sessId=...&secret=...
 * Retrieves the data for the given session ID and secret.
 */
export const getData = async (req: Request, res: Response): Promise<void> => {
    const sessId = req.query.sessId as string;
    const secret = req.query.secret as string;

    const session = sessions.get(sessId);
    if (session && session.secret === secret) {
        res.json({
            status: "ok",
            data: session.data,
            fetch_status: session.fetch_status,
            timestamp: session.timestamp,
        });
    } else {
        res.json({
            status: "error",
            error: "Session not found",
        });
    }
};

// Clean sessions up
const job = new CronJob(
    "* * * * *",
    function () {
        const now = Date.now();

        // Loop through every session
        for (const [sessId, data] of sessions.entries()) {
            lock.acquire(`session_${sessId}`, () => {
                // Delete if it's been more than 10 minutes
                if (now - data.timestamp > 10 * 60 * 1000) {
                    sessions.delete(sessId);
                    console.log(`Deleted session ${sessId}`);
                }
            });
        }
    },
    null,
    true,
    "America/Los_Angeles"
);
