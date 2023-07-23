export const getContractAddress = (chainId: number) => {
  let contractAddress: string = "";

  if (chainId === 43113) {
    contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_FUJI as string;
  } else if (chainId === 43114) {
    contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_AVALANCHE as string;
  }
  console.log("chainId", chainId);
  console.log("contractAddress", contractAddress);

  return contractAddress;
}

export const getRPC = (chainId: number) => {
  let rpc: string = "";

  if (chainId === 43113) {
    rpc = process.env.NEXT_PUBLIC_RPC_FUJI as string;
  } else if (chainId === 43114) {
    rpc = process.env.NEXT_PUBLIC_RPC_AVALANCHE as string;
  }

  return rpc;
}

export const isSupportedChain = (chainId: number) => {
  return chainId === 43113 || chainId === 43114;
}