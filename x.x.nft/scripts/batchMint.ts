import { ethers } from "hardhat";

async function main() {

  const NFTContract = await ethers.getContractFactory("SCBook");
  const nftContract = NFTContract.attach("0x19Ab20a5c4c77Cb5B78Ac8D4F618141e84f9782E");

  const toAddresses = [
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
    "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
    "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
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
