import { ethers } from "hardhat";

async function main() {

  const Contract = await ethers.getContractFactory("SCBook");
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log(`Deployed address : ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
