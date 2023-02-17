import { ethers } from "hardhat";

async function main() {

  const NFTContract = await ethers.getContractFactory("SCBook");
  const nftContract =  NFTContract.attach("0x84BF6b32e809bdDff68BfA8C1cc5c1630D63332F");

  const toAddresses = [
    "0x021006653ceDF465cA40AAc1dea57Bea241cdA6F",
    "0x021006653ceDF465cA40AAc1dea57Bea241cdA6F",
    "0x021006653ceDF465cA40AAc1dea57Bea241cdA6F",
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
