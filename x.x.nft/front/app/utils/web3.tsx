export const getContractAddress = (chainId: number) => {
  let contractAddress: string = "";

  if (chainId === 5) {
    contractAddress = process.env.CONTRACT_ADDRESS_GOERLI as string;
  } else if (chainId === 4) {
    contractAddress = process.env.CONTRACT_ADDRESS_AVALANCHE as string;
  }

  return contractAddress.substring(2);
}

export const isSupportedChain = (chainId: number) => {
  return chainId === 5 || chainId === 4;
}