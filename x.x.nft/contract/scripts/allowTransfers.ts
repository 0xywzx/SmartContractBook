import { ethers, network } from "hardhat";
import { getContractAddress } from "./contractAddress";

async function main() {

  const NFTContract = await ethers.getContractFactory("SCBook");
  const contractAddress = getContractAddress(network.name, "NFT");
  const nftContract = NFTContract.attach(contractAddress);

  const account = await ethers.getSigners();

  const tx = await nftContract.allowTransfers();
  console.log(`txhash : ${tx.hash}`);

  await tx.wait(1)
  console.log("allowTransfers enabeled");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
