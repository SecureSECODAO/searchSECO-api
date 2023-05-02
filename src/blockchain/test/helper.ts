/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { ethers, config } from "hardhat";
import { HardhatNetworkHDAccountsConfig } from "hardhat/types";
import Web3 from "web3";

/**
 * Creates a signature for the reward function
 * @param {string} _toReward Address to reward
 * @param {number} _hashCount Number of new hashes
 * @param {number} _nonce Nonce
 * @returns
 */
export const createSignature = async (
  _toReward: string,
  _hashCount: number,
  _nonce: number
) => {
  // One time setup for the web3 constants
  const accounts = config.networks.hardhat
    .accounts as HardhatNetworkHDAccountsConfig;
  const index = 0; // first wallet, increment for next wallets
  const wallet1 = ethers.Wallet.fromMnemonic(
    accounts.mnemonic,
    accounts.path + `/${index}`
  );

  const privateKey = wallet1.privateKey;

  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://127.0.0.1:65534") // arbitary
  );

  const packedMessage = web3.utils.encodePacked(
    {
      type: "address",
      value: _toReward,
    },
    {
      type: "uint256",
      value: _hashCount.toString(),
    },
    {
      type: "uint256",
      value: _nonce.toString(),
    }
  ) as string;

  // Sign the message
  const hashPackedMessage = web3.utils.soliditySha3(packedMessage) as string;

  const { messageHash: signedHashPackedMessage, signature } =
    web3.eth.accounts.sign(hashPackedMessage, privateKey);

  return {
    signature,
  };
};
