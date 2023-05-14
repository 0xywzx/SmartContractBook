import { ethers } from "hardhat";

async function main() {

  const NFTContract = await ethers.getContractFactory("SCBook");
  const nftContract = NFTContract.attach("0xC731bc0FF339a6D62E1792e18Be4D8034f0170C5");

  const result = await nftContract.tokenURI(0);
  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});