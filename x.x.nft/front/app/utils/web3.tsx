export const getContractAddress = (chainId: number) => {
  let contractAddress: string = "";

  if (chainId === 5) {
    contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_GOERLI as string;
  } else if (chainId === 43114) {
    contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_AVALANCHE as string;
  }

  return contractAddress;
}

export const getRPC = (chainId: number) => {
  let rpc: string = "";

  if (chainId === 5) {
    rpc = process.env.NEXT_PUBLIC_RPC_GOERLI as string;
  } else if (chainId === 43114) {
    rpc = process.env.NEXT_PUBLIC_RPC_AVALANCHE as string;
  }

  return rpc;
}

export const isSupportedChain = (chainId: number) => {
  return chainId === 5 || chainId === 43114;
}