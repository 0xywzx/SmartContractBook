import { ethers, network } from "hardhat";

import { getContractAddress } from "./contractAddress";

async function main() {

  let contractAddress = "";
  let linkTokenAddress = "";
  if (network.name === "fuji") {
    contractAddress = getContractAddress("NFTfuji");
  } else if (network.name === "avalanche") {
    contractAddress = getContractAddress("NFTavalanche");
  }

  const NFTContract = await ethers.getContractFactory("SCBook");
  const nftContract = NFTContract.attach(contractAddress as string);

  // const accounts = await ethers.getSigners();
  // const tx = await nftContract.safeMint(accounts[0].address);
  const tx = await nftContract.setMetadata();
  console.log(`txhash : ${tx.hash}`);
  await tx.wait();

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
