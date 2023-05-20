// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from "../utils/firebase"
import { Session } from '../../types/types'

export default async function requestOpen(
  req: NextApiRequest,
  res: NextApiResponse<Session>
) {
  console.info("--- API : requestOpen ---");
  // // GET以外のリクエストを許可しない
  // if (req.method.toLocaleLowerCase() !== 'get') {
  //   return res.status(405).end()
  // }

  // 任意の文字列の生成
  const message = ethers.utils.hexlify(ethers.utils.randomBytes(32));

  const docRef = await db.collection('sessions').add({
    akerunId: req.body.akerunId,
    message: message,
    status: 'requested',
    createdAt: new Date(),
    updateAt: new Date()
  });

  // sessionの保存とidの返却、firestoreとの通信
  const sessionId = docRef.id;

  console.log('>【Request】 Successfully Requested To Get Materials at Session:' + sessionId);
  console.log('-----------------');

  res.status(200).json({
    sessionId,
    message
  })
}