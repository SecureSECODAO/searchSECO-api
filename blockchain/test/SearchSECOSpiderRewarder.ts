/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, config } from "hardhat";
import { createSignature } from "./helper";

describe("Lock", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, alice] = await ethers.getSigners();

    const SearchSECOSpiderRewarder = await ethers.getContractFactory(
      "SearchSECOSpiderRewarder"
    );
    const searchSECOSpiderRewarder = await SearchSECOSpiderRewarder.deploy();

    return { contract: searchSECOSpiderRewarder, owner, alice };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { contract, owner } = await loadFixture(deployFixture);

      expect(await contract.owner()).to.equal(owner.address);
    });
  });

  describe("Rewarding", function () {
    it("Should increase hash count", async function () {
      const { contract, alice } = await loadFixture(deployFixture);

      const _toReward = alice;
      const _hashCount = 5;
      let _nonce = 0; // Normally this would be the count of the hashes already rewarded, read from the contract

      // Create signature
      let { signature } = await createSignature(
        _toReward.address,
        _hashCount,
        _nonce
      );

      // Claim reward
      await contract.reward(_toReward.address, _hashCount, _nonce, signature);

      // Check if the amount of hashes rewarded is correct
      expect(await contract.hashCount(_toReward.address)).to.equal(_hashCount);

      // Reward again
      _nonce = _hashCount;
      signature = (await createSignature(_toReward.address, _hashCount, _nonce))
        .signature;
      await contract.reward(_toReward.address, _hashCount, _nonce, signature);

      // Check if the amount of hashes rewarded is correct, again
      expect(await contract.hashCount(_toReward.address)).to.equal(
        _hashCount * 2
      );
    });
  });
});
