"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useContractRead } from 'wagmi';
import { getContract, signMessage } from '@wagmi/core'

import abi from '../../contract/artifacts/contracts/SCBook.sol/SCBook.json'
export default function Home() {

  const { address, isConnected } = useAccount()
  const { chain, chains } = useNetwork()

  const contractRead = useContractRead({
    address: '0xf0D1dbA6f1196080D275D1B3d60063dd8727534e',
    abi: abi.abi,
    functionName: 'tokenURI',
    chainId: chain?.id,
    args: [1],
    onError(error) {
      console.log('Error', error)
    },
  })

  const fetchToken = async () => {
    const contract = getContract({
      address: '0xf0D1dbA6f1196080D275D1B3d60063dd8727534e',
      abi: abi.abi,
      chainId: chain?.id,
    })

    const balance = await contract.read.balanceOf([address])
    if (balance == 0) return

    const tokenId = await contract.read.tokenOfOwnerByIndex([address, 0])
    console.log('tokenId', tokenId, address)

    const tokenURI = await contract.read.tokenURI([tokenId])
    console.log('tokenURI', tokenURI)
    const encodedData = tokenURI.substring(tokenURI.indexOf(',') + 1);
    const decodedData = JSON.parse(window.atob(encodedData));

    return decodedData
  };

  const [nftImage, setNftImage] = useState("");

  useEffect(() => {
    // console.log('address', address)
    // console.log('data', chain)
    fetchToken().then((data) => {
      if(!data) return;
      setNftImage(data.image);
    })
  }, [address, chain, contractRead])

  const handleSignMessage = async () => {
    const message = await signMessage({
      message: 'message',
    })
    console.log('message', message)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        Smart contract book
      </div>

      <ConnectButton accountStatus="avatar" />

      <div style={{ width: '400px' }}>
        <img src={nftImage} alt="Image" />
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleSignMessage}
      >
        Prove
      </button>
    </main>
  )
}
