// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from 'ethers'
import { NextResponse } from 'next/server';
import { db } from "../../utils/firebase"
import { Session } from '../../types/types'

export async function POST() {
  console.info("--- API : Session/Post ---");
  // // GET以外のリクエストを許可しない
  // if (req.method.toLocaleLowerCase() !== 'get') {
  //   return res.status(405).end()
  // }

  // 任意の文字列の生成
  const message: string = ethers.keccak256(ethers.randomBytes(32));
  console.log('>【Session/Post】 Created a Message: ' + message);

  const docRef = await db.collection('sessions').add({
    message: message,
    status: 'Requested',
    createdAt: new Date(),
    updateAt: new Date()
  });
  console.log('>【Session/Post】 Created a Session: ' + docRef);

  // sessionの保存とidの返却、firestoreとの通信
  const sessionId = docRef.id as string;

  console.log('>【Session/Post】 Successfully Create a Session: ' + sessionId);
  console.log('-----------------');

  return NextResponse.json({
    sessionId,
    message
  });
}