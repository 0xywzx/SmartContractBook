import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

require('dotenv').config()

const privateKey = process.env.PRIVATE_KEY;
const apiKey = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    // goerli: {
    //   url: process.env.GOERLI_RPC,
    //   accounts: [`0x${privateKey}`],
    // },
    hardhat: {
      
    }
  },
  etherscan: {
    apiKey: apiKey,
  },
};

export default config;
