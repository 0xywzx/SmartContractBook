import { ethers, network } from "hardhat";

import { getContractAddress } from "./contractAddress";

async function main() {

  let contractAddress = "";
  if (network.name === "fuji") {
    contractAddress = getContractAddress("NFTfuji");
  } else if (network.name === "avalanche") {
    contractAddress = getContractAddress("NFTavalanche");
  }

  const NFTContract = await ethers.getContractFactory("SCBook");
  const nftContract = NFTContract.attach(contractAddress as string);

  const requestId = await nftContract.lastRequestId();

  console.log(
    "Requested",
    await nftContract.getRequestStatus(requestId)
  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
