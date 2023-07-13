"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { getContract, signMessage } from '@wagmi/core'

import abi from './types/SCBook.json'
import { Content, Session } from './types/types';
import { createSession, readContent } from './utils/api';
import { getContractAddress, isSupportedChain } from './utils/web3';
import LoadingIcon from './components/LoadingIcon';
export default function Home() {

  const { address, isConnected } = useAccount()
  const { chain, chains } = useNetwork()

  const [balance, setBalance] = useState(0);
  const [currentTokenIdIndex, setCurrentTokenIdIndex] = useState(0);
  const [tokenId, setTokenId] = useState("");
  const [nftImage, setNftImage] = useState("");
  const [rarity, setRarity] = useState("");
  const [content, setContent] = useState("");
  const [isProving, setIsProving] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const fetchNFT = async () => {
    if (!address || !chain || !isSupportedChain(chain.id)) return

    const contract = getContract({
      address: `0x${getContractAddress(chain.id).slice(2)}`,
      abi: abi.abi,
      chainId: chain?.id,
    })

    const balance = await contract.read.balanceOf([address]) as number;
    if (balance == 0) {
      setTokenId("");
      setNftImage("");
      setRarity("");
      return
    }
    if (balance >= 1) { setBalance(Number(balance)) };

    const decodedData = await fetchDecodedMetadata(contract, currentTokenIdIndex);
    return decodedData
  };

  const fetchDecodedMetadata = async (contract: any, tokenIdIndex: number) => {
    const tokenId = await contract.read.tokenOfOwnerByIndex([address, tokenIdIndex]) as string;
    setTokenId(tokenId);

    const tokenURI = await contract.read.tokenURI([tokenId]) as string;
    const encodedData = tokenURI.substring(tokenURI.indexOf(',') + 1);
    const decodedData = JSON.parse(window.atob(encodedData));

    return decodedData
  }

  const fetchNewNFT = async (index: number) => {
    if (!address || !chain || !isSupportedChain(chain.id)) return

    const contract = getContract({
      address: `0x${getContractAddress(chain.id).slice(2)}`,
      abi: abi.abi,
      chainId: chain?.id,
    })

    const decodedData = await fetchDecodedMetadata(contract, index);

    setRarity(decodedData.attributes[0].value);
    setNftImage(decodedData.image);
  };

  useEffect(() => {
    fetchNFT().then((data) => {
      if(!data) return;
      setRarity(data.attributes[0].value);
      setNftImage(data.image);
    })
    // there was an error due to discrepancies between the client and server-side when using isConnected
    if (isConnected) {
      setIsWalletConnected(true)
    }
  }, [address, chain, isConnected])

  const handleSwitchChain = async () => {
    console.log('handleSwitchChain');
    // todo: switch chain
  }

  const handleSignMessage = async () => {
    console.log('handleSignMessage');
    setIsProving(true);
    try {
      const session = await createSession() as Session;
      console.log('session', session);

      const signature = await signMessage({
        message: session.message,
      });
      console.log('signature', signature);

      console.log('fetching content');
      const content = await readContent(
        currentTokenIdIndex,
        chain?.id as number,
        session.sessionId,
        signature
      );
      setContent(content.content);
      console.log('successfully fetched content');
    } catch (error) {
      console.log('error', error);
      setIsProving(false);
    } finally {
      setIsProving(false);
    }
  }

  const nextNFT = () => {
    if (currentTokenIdIndex >= balance - 1) return;
    const nextIndex = currentTokenIdIndex + 1;
    setCurrentTokenIdIndex(nextIndex);
    fetchNewNFT(nextIndex);
  };

  const prevNFT = () => {
    if (currentTokenIdIndex <= 0) return;
    const prevIndex = currentTokenIdIndex - 1;
    setCurrentTokenIdIndex(prevIndex);
    fetchNewNFT(prevIndex);
  };

  return (
    <main className="flex flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Smart Contract Book</h1>

      <ConnectButton accountStatus="avatar" />

      {isWalletConnected ? (
        <>
          {chain && !isSupportedChain(chain.id) && (
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

          {nftImage ? (
            <>
              <div className="flex flex-col items-center justify-center">
                <div className="py-4" style={{ maxWidth: '400px' }}>
                  <img src={nftImage} alt="Image" className="max-w-full" />
                </div>
                <div className="flex justify-center my-2">
                {currentTokenIdIndex > 0 && (
                  <button
                    className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 text-black w-12 h-12 rounded-full"
                    onClick={prevNFT}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {currentTokenIdIndex < balance - 1 && (
                  <button
                    className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 text-black w-12 h-12 rounded-full ml-4"
                    onClick={nextNFT}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                </div>
                <div className="mb-4">
                  <p>TokenID: {Number(tokenId)}</p>
                  <p>Rarity: {rarity}</p>
                </div>
              </div>
              <button
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ${
                  isProving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSignMessage}
                disabled={isProving}
              >
                {isProving ? (
                  <div className="flex items-center">
                    <LoadingIcon />
                    <span>Proving...</span>
                  </div>
                ) : (
                  'Access Content'
                )}
              </button>

              {/* content */}
              <div className="mx-8 mt-8 md:w-1/2 w-full" dangerouslySetInnerHTML={{ __html: content }} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center my-8">
              <p>This address does not own an NFT.</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center my-8">
            <p>Please connect your account to access the content.</p>
          </div>
        </>
      )}
    </main>
  )
}

