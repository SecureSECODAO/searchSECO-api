import config from "../config/config";
import Web3 from "web3";
import { mnemonicToSeed } from "bip39";
import hdkey from "hdkey";
import { Request, Response } from "express";
import { client } from "./monetization";
import { abi } from "../abi/rewarding_abi";
import { dbClient } from "../app";

const web3provider = new Web3(
    new Web3.providers.HttpProvider(
        // Doesn't really matter, this object is only used to generate the proof
        config.NODE_ENV === "development" ? "http://127.0.0.1:65534" : "..."
    )
);

/**
 * Gets the private key of the account that will be used to sign the proof.
 * @returns the private key of the account that will be used to sign the proof
 */
const getPrivateKey = async () => {
    if (config.NODE_ENV === "production") {
        return config.PRIVATE_KEY;
    } else {
        // The code snippet below will get the private key of the first account generated from the mnemonic
        const hdkDerivePath = "m/44'/60'/0'/0/0";
        const seed = await mnemonicToSeed(config.DEV_MNEMONIC);
        const hdk = hdkey.fromMasterSeed(seed);
        const addr_node = hdk.derive(hdkDerivePath); // Gets first account
        const private_key = addr_node.privateKey;

        return private_key.toString("hex");
    }
};

/**
 * Generates a proof that the user can use to claim their reward.
 * @param toReward the address of the user to reward
 * @param hashCount the new number of hashes the user has submitted
 * @param nonce a nonce
 * @returns
 */
const generateProof = async (
    toReward: string,
    hashCount: number,
    nonce: number
) => {
    // Bundle the address, hash count and nonce and then hash it (keccak256)
    const hashedMessage = web3provider.utils.soliditySha3(
        web3provider.utils.encodePacked(
            {
                type: "address",
                value: toReward,
            },
            {
                type: "uint256",
                value: hashCount as any,
            },
            {
                type: "uint256",
                value: nonce as any,
            }
        )
    );

    // Sign the hashed message
    const key = await getPrivateKey();
    const signedData = web3provider.eth.accounts.sign(hashedMessage, key);

    // Return the signature
    const sig = signedData.signature;

    return {
        sig,
    };
};

/**
 * POST /reward
 * Checks the hashes submitted by the user and generates a proof that the user can use to claim their reward.
 */
export const reward = async (req: Request, res: Response): Promise<void> => {
    const { address } = req.body;

    try {
        const result = await dbClient.execute(
            "SELECT * FROM rewarding.miners WHERE wallet = ? ALLOW FILTERING", // FIXME: Remove ALLOW FILTERING
            [req.query.address],
            { prepare: true }
        );

        if (result.rows.length === 0) {
            res.json({
                status: "error",
                error: "Address not found",
            });
            return;
        }

        let totalHashes = 0;
        for (const row of result.rows) {
            totalHashes += parseInt(row.claimable_hashes);
        }

        let data;
        // Retrieve the user's current hash count, use this as the nonce
        if (config.NODE_ENV !== "test") {
            data = await client.readContract({
                address: config.DAO_CONTRACT_ADDRESS,
                abi,
                functionName: "getHashCount",
                args: [address],
            });
        } else {
            data = 1;
            console.log("Using test data");
        }

        const nonce = data as number;

        // Generate proof
        const proof = await generateProof(address, totalHashes, nonce);

        res.json({
            status: "ok",
            proof,
        });
    } catch (error: any) {
        console.error(error);
        res.json({
            status: "error",
            error: error.message,
        });
    }
};

export const miningData = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const result = await dbClient.execute(
            "SELECT * FROM rewarding.miners WHERE wallet = ? ALLOW FILTERING", // FIXME: Remove ALLOW FILTERING
            [req.query.address],
            { prepare: true }
        );

        res.json({
            status: "ok",
            data: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.json({
            status: "error",
            error: error.message,
        });
    }
};
