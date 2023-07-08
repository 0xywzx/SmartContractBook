import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

require('dotenv').config()

const privateKey = process.env.PRIVATE_KEY;
const apiKey = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        details: {
          yulDetails: {
            optimizerSteps: "u:",
          },
        },
      },
    },
  },
  networks: {
    hardhat: {
      blockGasLimit: 3000000000,
    },
    fuji: {
      url: process.env.FUJI_RPC,
      chainId: 43113,
      accounts: [`0x${privateKey}`],
    },
    avalanche: {
      url: process.env.AVALANCHE_RPC,
      chainId: 43114,
      accounts: [`0x${privateKey}`],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    token: 'AVAX',
    // gasPrice: 10,
    gasPriceApi: 'https://api.snowtrace.io/api?module=proxy&action=eth_gasPrice',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  }
};

export default config;
