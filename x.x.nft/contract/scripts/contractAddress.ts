const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../contractAddress.json");

export const getContractAddress = (contractName: string) => {
  try {

    const jsonData = fs.readFileSync(filePath);
    const config = JSON.parse(jsonData);

    const contractAddress = config[contractName];

    return contractAddress;
  } catch (error) {
    console.error('Error reading contract address:', error);
    return null;
  }
}

export const saveContractAddress = (contractName: string, contractAddress: string) => {
  let deployments = {} as any;
  if (fs.existsSync(filePath)) {
    deployments = JSON.parse(fs.readFileSync(filePath));
  }

  deployments[contractName] = contractAddress;

  fs.writeFileSync(filePath, JSON.stringify(deployments, null, 2));
}
