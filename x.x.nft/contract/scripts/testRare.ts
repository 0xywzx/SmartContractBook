import { ethers } from "hardhat";

async function main() {

  const NFTContract = await ethers.getContractFactory("SCBook");
  const nftContract = await NFTContract.deploy();

  await nftContract.deployed();
  console.log(`Deployed address : ${nftContract.address}`);

  const addresses = [];
  for (let i = 0; i < 2000; i++) {
    const wallet = ethers.Wallet.createRandom();
    addresses.push(wallet.address);
  }

  const batchSize = 100;
  const numBatches = Math.ceil(addresses.length / batchSize);

  for (let batchIndex = 0; batchIndex < numBatches; batchIndex++) {
    const start = batchIndex * batchSize;
    const end = Math.min(start + batchSize, addresses.length);
    const batchAddresses = addresses.slice(start, end);

    const transaction = await nftContract.batchMint(batchAddresses);
    await transaction.wait(); // Wait for the transaction to be mined
    console.log(`Minted NFT batch ${batchIndex + 1} with ${batchAddresses.length} addresses`);
  }

  let rate = 0;
  for (let i = 0; i < addresses.length; i++) {
    const result = await nftContract.getMetadata(i);
    if (Number(result.random) % 49 === 0) {
      console.log(`NFT ${i} is rare`);
      rate++;
    }
  }
  console.log(`Rare rate: ${rate / addresses.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});