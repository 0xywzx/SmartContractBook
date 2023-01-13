const { HDNode } = require("@ethersproject/hdnode");
const { publicKeyCreate } = require('secp256k1');
const { keccak256 } = require("@ethersproject/keccak256");

function main() {
  // 1. seed phraseから秘密鍵の生成
  const seedPhrase = "disagree fat tired erase october bulb raise cluster hip various near panic";
  const privateKey = HDNode.fromMnemonic(seedPhrase).derivePath("m/44'/60'/0'/0/0").privateKey;
  console.log("Private Kay :", privateKey);

  // 2. ECDSAで秘密鍵に対応する公開鍵を生成
  const privateKeyBuffer = Buffer.from(privateKey.slice(2), 'hex');
  const publicKey = Buffer.from(publicKeyCreate(privateKeyBuffer, false)).toString('hex');
  console.log("Public Key :", publicKey);

  // 3. 公開鍵をkecak256でハッシュ化
  const hashedPublicKey = keccak256(Buffer.from(publicKey.slice(2), 'hex'));
  console.log("Hashed Public Key :", hashedPublicKey)

  // 4.末尾20bytes(40文字)を取得し、先頭に0xをつける
  const address = hashedPublicKey.slice(-40);
  console.log("Address :", "0x" + address);

}

main()