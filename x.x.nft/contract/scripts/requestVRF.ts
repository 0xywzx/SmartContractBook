import { ethers } from "hardhat";
import hre from "hardhat";

import { getContractAddress } from "./contractAddress";

async function main() {

  let contractAddress = "";
  if (hre.network.name === "fuji") {
    contractAddress = getContractAddress("NFTfuji");
  } else if (hre.network.name === "avalance") {
    contractAddress = getContractAddress("NFTavalanche");
  }

  const NFTContract = await ethers.getContractFactory("SCBook");
  const nftContract = NFTContract.attach(contractAddress as string);

  const tx = await nftContract.requestRandomWords();
  console.log(`txhash : ${tx.hash}`);
  const receipt = await tx.wait();
  const requestId = receipt.events?.[0]?.args?.requestId;

  console.log(
    "Requested",
    await nftContract.getRequestStatus(requestId)
  );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
