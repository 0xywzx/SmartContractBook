const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../contractAddress.json");

export const getContractAddress = (
  networkName: string,
  contractName: string
) => {
  try {
    const jsonData = fs.readFileSync(filePath);
    const config = JSON.parse(jsonData);

    const contractAddress = config[contractName][networkName];

    if (!contractAddress) {
      throw new Error(`No address found for ${contractName} on ${networkName}`);
    }

    return contractAddress;
  } catch (error) {
    console.error('Error reading contract address:', error);
    return null;
  }
}

export const saveContractAddress = (
  networkName: string,
  contractName: string,
  contractAddress: string
) => {
  let config = {} as any;
  if (fs.existsSync(filePath)) {
    config = JSON.parse(fs.readFileSync(filePath));
  }

  if (!config[contractName]) {
    config[contractName] = {};
  }

  config[contractName][networkName] = contractAddress;

  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
}
