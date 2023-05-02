/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { ethers } from "hardhat";

async function main() {
  const SearchSECOSpiderRewarder = await ethers.getContractFactory(
    "SearchSECOSpiderRewarder"
  );
  const searchSECOSpiderRewarder = await SearchSECOSpiderRewarder.deploy();

  await searchSECOSpiderRewarder.deployed();

  console.log(
    "SearchSECOSpiderRewarder deployed to:",
    searchSECOSpiderRewarder.address
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
