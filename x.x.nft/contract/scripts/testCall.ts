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

  const accounts = await ethers.getSigners();
  const tx = await nftContract.safeMint(accounts[0].address);
  console.log(`NFT minted : ${tx.hash}`);

  console.log(await nftContract.tokenURI(0));
  console.log(await nftContract.getMetadata(0));
  // const Libraty = await ethers.getContractFactory("NFTSVG");
  // const library = Libraty.attach(nftContract.address);
  // console.log(await library.tokenToColorHex(1234, 0));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});