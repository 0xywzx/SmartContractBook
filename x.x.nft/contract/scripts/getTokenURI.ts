import { ethers, network } from "hardhat";

import { getContractAddress } from "./contractAddress";

async function main() {

  let contractAddress = getContractAddress(network.name, "NFT");

  const NFTContract = await ethers.getContractFactory("SmartContractBook");
  const nftContract = NFTContract.attach(contractAddress as string);

  console.log(await nftContract.tokenURI(3));
  console.log(await nftContract.getMetadata(3));

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
