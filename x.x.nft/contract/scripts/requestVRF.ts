import { ethers, network } from "hardhat";

import { getContractAddress } from "./contractAddress";

async function main() {

  let contractAddress = "";
  let linkTokenAddress = "";
  if (network.name === "fuji") {
    contractAddress = getContractAddress("NFTfuji");
    linkTokenAddress = getContractAddress("LinkFuji");
  } else if (network.name === "avalanche") {
    contractAddress = getContractAddress("NFTavalanche");
    linkTokenAddress = getContractAddress("LinkAvalanche");
  }
  const NFTContract = await ethers.getContractFactory("SCBook");
  const nftContract = NFTContract.attach(contractAddress as string);

  const linkContract = new ethers.Contract(
    linkTokenAddress,
    ["function balanceOf(address account) view returns (uint256)"],
    new ethers.providers.JsonRpcProvider(network.config.url)
  );

  console.log(
    "NFT contract's Link token balance : ",
    await linkContract.balanceOf(contractAddress)
  )

  console.log(`------ \n Requesting VRF.`)
  const tx = await nftContract.requestRandomWords({
    gasLimit: "5000000"
  });
  await tx.wait();
  console.log("VRF has been requested.")
  console.log(`txhash : ${tx.hash}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
