import { ethers, network } from "hardhat";
import { getContractAddress } from "./contractAddress";

async function main() {

  const NFTContract = await ethers.getContractFactory("SmartContractBook");
  const contractAddress = getContractAddress(network.name, "NFT");
  const nftContract = NFTContract.attach(contractAddress);

  const toAddresses = [
    "0x021006653ceDF465cA40AAc1dea57Bea241cdA6F",
    "0x021006653ceDF465cA40AAc1dea57Bea241cdA6F",
    "0x021006653ceDF465cA40AAc1dea57Bea241cdA6F"
  ];

  const tx = await nftContract.batchMint(toAddresses);
  console.log(`txhash : ${tx.hash}`);

  await tx.wait(1)
  console.log("Minted");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
