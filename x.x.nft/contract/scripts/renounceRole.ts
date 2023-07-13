import { ethers, network } from "hardhat";
import { getContractAddress } from "./contractAddress";

async function main() {

  const NFTContract = await ethers.getContractFactory("SmartContractBook");
  const contractAddress = getContractAddress(network.name, "NFT");
  const nftContract = NFTContract.attach(contractAddress);

  const account = await ethers.getSigners();

  const tx = await nftContract.renounceRole(
    account[0].address,
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE'))
  );
  console.log(`txhash : ${tx.hash}`);

  await tx.wait(1)
  console.log("Renounced");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
