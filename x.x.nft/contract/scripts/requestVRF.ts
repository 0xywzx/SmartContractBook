import { ethers, network } from "hardhat";

import { getContractAddress } from "./contractAddress";

async function main() {

  let contractAddress = "";
  if (network.name === "fuji") {
    contractAddress = getContractAddress("NFTfuji");
  } else if (network.name === "avalance") {
    contractAddress = getContractAddress("NFTavalanche");
  }

  const NFTContract = await ethers.getContractFactory("SCBook");
  const nftContract = NFTContract.attach(contractAddress as string);

  console.log(
    await nftContract.lastRequestId()
  )
  // const tx = await nftContract.requestRandomWords();
  // console.log(`txhash : ${tx.hash}`);
  // const receipt = await tx.wait();
  // const requestId = receipt.events?.[0]?.args?.requestId;

  // console.log(
  //   "Requested",
  //   await nftContract.getRequestStatus(requestId)
  // );

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
