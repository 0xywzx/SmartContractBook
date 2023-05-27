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
      const content = await readContent(chain?.id as number, session.sessionId, signature);
      setContent(content.content);
      console.log('successfully fetched content');
    } catch (error) {
      console.log('error', error);
      setIsProving(false);
    } finally {
      setIsProving(false);
    }
  }

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
                  <div className="mb-4">
                    <p>TokenID: {tokenId}</p>
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

                <div className="mt-8">
                  {content}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <p>This address does not own an NFT.</p>
              </div>
            )}
          </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center">
                <p>Please connect your account to access the content.</p>
              </div>
            </>
          )}

    </main>
  )
}

