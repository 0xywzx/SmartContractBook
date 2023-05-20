"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useContractRead } from 'wagmi';
import { getContract, signMessage } from '@wagmi/core'

import abi from '../../contract/artifacts/contracts/SCBook.sol/SCBook.json'
import { ethers, hexlify } from 'ethers';
import { Content, Session } from './types/types';
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

    const tokenURI = await contract.read.tokenURI([tokenId]) as string;

    const encodedData = tokenURI.substring(tokenURI.indexOf(',') + 1);
    const decodedData = JSON.parse(window.atob(encodedData));

    return decodedData
  };

  const [nftImage, setNftImage] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // console.log('address', address)
    // console.log('data', chain)
    fetchToken().then((data) => {
      if(!data) return;
      setNftImage(data.image);
    })
  }, [address, chain, contractRead])

  const handleSignMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch session");
    };

    const data = await response.json() as Session;
    console.log('data', data);

    const signature = await signMessage({
      message: data.message,
    });
    console.log('message', signature);

    const params = new URLSearchParams();
    params.append("sessionId", data.sessionId);
    params.append("signature", signature);

    const materialResponse = await fetch(`/api/content?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    console.log('materialResponse', materialResponse);
    if (!materialResponse.ok) {
      throw new Error("Does not have permission to access the content");
    };
    const content = await materialResponse.json() as Content;
    setContent(content.content);
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

      <div>
        {content}
      </div>
    </main>
  )
}
