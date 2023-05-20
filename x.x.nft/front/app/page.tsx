"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { getContract, signMessage } from '@wagmi/core'

import abi from '../../contract/artifacts/contracts/SCBook.sol/SCBook.json'
import { Content, Session } from './types/types';
import { createSession, readContent } from './utils/api';
import { getContractAddress, isSupportedChain } from './utils/web3';
export default function Home() {

  const { address, isConnected } = useAccount()
  const { chain, chains } = useNetwork()

  const [tokenId, setTokenId] = useState("");
  const [nftImage, setNftImage] = useState("");
  const [rarity, setRarity] = useState("");
  const [content, setContent] = useState("");

  const fetchNFT = async () => {
    if (!address || !chain) return
    console.log(chain);
    const contract = getContract({
      address: `0x${getContractAddress(chain.id)}`,
      abi: abi.abi,
      chainId: chain?.id,
    })

    const balance = await contract.read.balanceOf([address])
    if (balance == 0) {
      setTokenId("");
      setNftImage("");
      setRarity("");
      return
    }

    const tokenId = await contract.read.tokenOfOwnerByIndex([address, 0]) as string;
    setTokenId(tokenId);

    const tokenURI = await contract.read.tokenURI([tokenId]) as string;
    const encodedData = tokenURI.substring(tokenURI.indexOf(',') + 1);
    const decodedData = JSON.parse(window.atob(encodedData));

    return decodedData
  };

  useEffect(() => {
    fetchNFT().then((data) => {
      if(!data) return;
      setRarity(data.attributes[0].value);
      setNftImage(data.image);
    })
  }, [address, chain])

  const handleSwitchChain = async () => {
    console.log('handleSwitchChain');
    // todo: switch chain
  }

  const handleSignMessage = async () => {
    console.log('handleSignMessage');

    const session = await createSession() as Session;
    console.log('session', session);

    const signature = await signMessage({
      message: session.message,
    });
    console.log('signature', signature);

    console.log('fetching content');
    const content = await readContent(session.sessionId, signature);

    setContent(content.content);
  }

  return (
    <main className="flex flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Smart Contract Book</h1>

      <ConnectButton accountStatus="avatar" />

      {isConnected ? (
        <>
          {chain && isSupportedChain(chain.id) && (
            <div className="flex flex-col items-center justify-center mt-4">
              <p>Please switch to the desired chain to access the content.</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={handleSwitchChain}
              >
                Switch Chain
              </button>
            </div>
          )}

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleSignMessage}
          >
            Access Content
          </button>

          {nftImage ? (
            <div className="flex flex-col items-center justify-center">
              <div className="py-4" style={{ maxWidth: '400px' }}>
                <img src={nftImage} alt="Image" className="max-w-full" />
              </div>
              <div className="mb-4">
                <p>TokenID: {tokenId}</p>
                <p>Rarity: {rarity}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p>This address does not own an NFT.</p>
            </div>
          )}

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleSignMessage}
          >
            Access Content
          </button>

          <div className="mt-8">
            {content}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p>Please connect your account to access the content.</p>
        </div>
      )}
    </main>
  )
}
