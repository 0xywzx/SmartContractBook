import { ethers, network } from "hardhat";

import { getContractAddress } from "./contractAddress";

async function main() {

  let contractAddress = getContractAddress(network.name, "NFT");

  const NFTContract = await ethers.getContractFactory("SCBook");
  const nftContract = NFTContract.attach(contractAddress as string);

  console.log(`------ \n Withdrawing Link.`);
  const tx = await nftContract.withdrawLink();
  await tx.wait();
  console.log("Link has been withdrawn.");
  console.log(`txhash : ${tx.hash}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
