import { ethers, network } from "hardhat";

import { getContractAddress } from "./contractAddress";

async function main() {

  let contractAddress = getContractAddress(network.name, "NFT");

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
