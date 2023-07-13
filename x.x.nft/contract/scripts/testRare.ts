import { ethers } from "hardhat";

async function main() {

  const NFTContract = await ethers.getContractFactory("SmartContractBook");

  // https://docs.chain.link/vrf/v2/direct-funding/supported-networks
  const nftContract = await NFTContract.deploy(
    "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846", // LINK Token on fuji
    "0x9345AC54dA4D0B5Cda8CB749d8ef37e5F02BBb21" // VRF Wrapper on fuji
  );

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