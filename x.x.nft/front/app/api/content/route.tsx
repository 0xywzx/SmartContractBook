// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Contract, ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server';
import { db } from "../../utils/firebase"
import { Session } from '../../types/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId') as string;
  const signature = searchParams.get('signature') as string;

  const doc =
    await db.collection('sessions').doc(sessionId).get();
  const session = doc.data();

  if (!session) {
    console.log('>【Content/Get】 No session');
    return NextResponse.json({
      content: 'No session'
    });
  }

  if (session.status != "Requested") {
    return NextResponse.json({
      content: 'Session is already used'
    })
  };
  console.log('>【Content/Get】 Successfully fetched session : ', sessionId);

  // 署名とsessionのメッセージからアドレスを復元
  const recoverdAddress = await ethers.verifyMessage(
    session.message,
    signature
  ) as string;

  console.log('>【Content/Get】 Recovered Address : ' + recoverdAddress);

  // 復元したアドレスがNFTを所有してるか確認
  const abi = [
    "function balanceOf(address account) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string memory)"
  ];
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC)
  const contract = new Contract(
    "0xf0D1dbA6f1196080D275D1B3d60063dd8727534e", abi, provider
  );

  const balance = await contract.balanceOf(recoverdAddress);

  if (balance == 0) {
    console.log('>【Content/Get】 Not NFT Owner ', recoverdAddress);
    return NextResponse.json({
      content: 'Not NFT Owner'
    });
  };

  console.log('>【Content/Get】 NFT Owner', recoverdAddress);
  const tokenId = await contract.tokenOfOwnerByIndex(recoverdAddress, 0)
  const tokenURI = await contract.tokenURI(tokenId) as string;

  const encodedData = tokenURI.substring(tokenURI.indexOf(',') + 1);
  const buffer = Buffer.from(encodedData, 'base64');
  const decodedData = JSON.parse(buffer.toString('utf-8'));

  const rarity = decodedData.attributes[0].value as string;
  console.log('>【Content/Get】NFT rarity', rarity);

  const content = rarity == "rare" ? "Secret content" : "Common content";
  console.log('-----------------');

  return NextResponse.json({
    content
  });

}