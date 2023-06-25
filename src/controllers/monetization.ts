/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * � Copyright Utrecht University (Department of Information and Computing Sciences)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { celebrate, Joi } from "celebrate";
import { Router, Request, Response } from "express";
import * as controller from "../controllers/monetization";
import { BigNumber, ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";
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

// Create a provider so we can read from the blockchain
const provider = new ethers.providers.JsonRpcProvider(
    process.env.NODE_ENV === "production"
        ? "https://rpc.ankr.com/polygon"
        : "https://rpc.ankr.com/polygon_mumbai"
);

// Create contract instance so we can listen to events and call functions
export const contract = new ethers.Contract(
    process.env.DAO_CONTRACT_ADDRESS as any,
    abi,
    provider
);

/**
 * Represents a session. A session is used to track the status of a payment / query.
 */
type SessionData = {
    secret: string;
    hashes: string[];
    timestamp: number;
    fetch_status: "idle" | "pending" | "success" | "error";
    data?: any;
    error?: string;
};

/**
 * Stores the hashes for each session ID
 */
const sessions = new Map<string, SessionData>();

/**
 * POST /cost
 * Retrieves amount of hashes contained with the given GitHub repository.
 */
export const cost = async (req: Request, res: Response): Promise<void> => {
    const url = req.body.url as string;
    const branch = req.body.branch as string;

    try {
        // Get hash cost
        const data: BigNumber = await contract.getHashCost();

        let costPerHash = data;
        const hashes = await fetchHashes(url, branch);

        let totalCost = costPerHash.mul(BigNumber.from(hashes.length));

        res.json({
            status: "ok",
            cost: totalCost.toHexString().substring(2),
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
 * Watch for sessions that are paid, then handle them.
 */
contract.on(
    "PaymentProcessed(address,uint256,string)",
    (sender, amount, uniqueId: string) => {
        console.log(
            `PaymentProcessed(sender: ${sender}, amount: ${amount}, uniqueId: ${uniqueId})`
        );

        handlePaidSession(amount, uniqueId);
    }
);

/**
 * This function is called when a session is paid, and it will fetch the data
 * for the given hashes from the database API.
 * @param amount Amount of hashes paid for
 * @param sessId Session ID to handle
 */
const handlePaidSession = async (
    amount: BigNumber,
    sessId: string
): Promise<void> => {
    await lock.acquire(`session_${sessId}`, async () => {
        const session = sessions.get(sessId);

        if (session) {
            // Make sure that enough hashes were paid for
            if (BigNumber.from(session.hashes.length).gt(amount)) {
                console.log(
                    `Session ${sessId} was paid, but not enough hashes were paid for (${amount} < ${session.hashes.length})`
                );
                session.fetch_status = "error";
                session.error = `Not enough hashes were paid for, expected ${session.hashes.length}, got ${amount}`;
                return;
            }

            console.log(
                `Session ${sessId} was paid, num. of hashes: ${session.hashes.length}`
            );

            session.fetch_status = "pending";

            console.log(`Fetching data for session ${sessId}...`);
            try {
                const response = await checkHashes(session.hashes);
                if (!response) throw new Error("No response from checkHashes");

                session.fetch_status = "success";
                session.data = response;

                console.log(`Session ${sessId} data fetched!`);
                // console.log(response);
            } catch (error) {
                console.error(error);
                session.fetch_status = "error";
                session.error = error.message || "Unknown error";
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
            error: session.error,
        });
    } else {
        res.json({
            status: "error",
            error: "SESSION_NOT_FOUND",
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
                let deleteSession = false;
                switch (data.fetch_status) {
                    case "idle":
                    case "error":
                        deleteSession = now - data.timestamp > 10 * 60 * 1000; // 10 minutes
                        break;

                    case "pending":
                        deleteSession = now - data.timestamp > 30 * 60 * 1000; // 30 minutes
                        break;

                    case "success":
                        deleteSession =
                            now - data.timestamp > 24 * 60 * 60 * 1000; // 24 hours
                        break;
                }

                // Delete if it's been more than 10 minutes
                if (deleteSession) {
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
