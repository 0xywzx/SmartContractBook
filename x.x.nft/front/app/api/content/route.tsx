// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getContractAddress, getRPC } from '@/app/utils/web3';
import { Contract, ethers } from 'ethers'
import { NextResponse } from 'next/server';
import { db } from "../../utils/firebase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenIdIndex = Number(searchParams.get('tokenIdIndex'));
  const chainId = Number(searchParams.get('chainId'));
  const sessionId = searchParams.get('sessionId') as string;
  const signature = searchParams.get('signature') as string;

  // fetch session
  const doc =
    await db.collection('sessions').doc(sessionId).get();
  const session = doc.data();

  if (!session) {
    console.log('>【Content/Get No session');
    return NextResponse.json({
      content: 'No session'
    });
  };

  if (session.status != "Requested") {
    return NextResponse.json({
      content: 'Session is already used'
    })
  };

  console.log('>【Content/Get】Successfully fetched session : ', sessionId);

  // recover address from signature and message
  const recoverdAddress = await ethers.verifyMessage(
    session.message,
    signature
  ) as string;
  console.log('>【Content/Get】Recovered Address : ' + recoverdAddress);

  // Check if the address is the owner of the NFT
  const abi = [
    "function balanceOf(address account) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string memory)"
  ];
  const provider = new ethers.JsonRpcProvider(getRPC(chainId));
  const contract = new Contract(
    getContractAddress(chainId), abi, provider
  );

  const balance = await contract.balanceOf(recoverdAddress);

  if (balance == 0) {
    console.log('>【Content/Get】Not NFT Owner ', recoverdAddress);
    return NextResponse.json({
      content: 'Not NFT Owner'
    });
  };
  console.log('>【Content/Get】NFT Owner', recoverdAddress);

  // Get NFT rarity
  console.log('>【Content/Get】Token index', tokenIdIndex);
  const tokenId = await contract.tokenOfOwnerByIndex(recoverdAddress, tokenIdIndex) as string;
  const tokenURI = await contract.tokenURI(tokenId) as string;

  const encodedData = tokenURI.substring(tokenURI.indexOf(',') + 1);
  const buffer = Buffer.from(encodedData, 'base64');
  const decodedData = JSON.parse(buffer.toString('utf-8'));

  const rarity = decodedData.attributes[0].value as string;
  console.log('>【Content/Get】NFT rarity', rarity);

  const collectionId = chainId == 43114 ? "contents" : "testContents";
  const contentDoc =
    await db.collection(collectionId).doc(rarity).get();

  const content = contentDoc.data()!.content;
  console.log('-----------------');

  return NextResponse.json({
    content
  });

}