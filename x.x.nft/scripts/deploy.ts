import { ethers } from "hardhat";

async function main() {

  const NFTContract = await ethers.getContractFactory("SCBook");
  const nftContract = await NFTContract.deploy();

  await nftContract.deployed();
  console.log(`Deployed address : ${nftContract.address}`);

  const accounts = await ethers.getSigners();
  const tx = await nftContract.safeMint(accounts[0].address);
  console.log(`NFT minted : ${tx.hash}`);

  console.log(await nftContract.tokenURI(0));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
