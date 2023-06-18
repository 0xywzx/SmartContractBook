import { ethers, network } from "hardhat";
import { getContractAddress, saveContractAddress } from "./contractAddress";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const NFTContract = await ethers.getContractFactory("SCBook");

  let linkTokenAddress
  let wrapperAddress

  if (network.name === "fuji") {
    linkTokenAddress = getContractAddress("LinkFuji");
    wrapperAddress = getContractAddress("WrapperFuji")
  } else if (network.name === "avalanche") {
    linkTokenAddress = getContractAddress("LinkAvalanche");
    wrapperAddress = getContractAddress("WrapperAvalanche");
  }

  // https://docs.chain.link/vrf/v2/direct-funding/supported-networks
  const nftContract = await NFTContract.deploy(
    linkTokenAddress,
    wrapperAddress
  );

  await nftContract.deployed();
  console.log(`Deployed address : ${nftContract.address}`);
  saveContractAddress("NFTfuji", nftContract.address);

  const accounts = await ethers.getSigners();
  const tx = await nftContract.safeMint(accounts[0].address);
  await tx.wait();
  console.log(`NFT minted : ${tx.hash}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
