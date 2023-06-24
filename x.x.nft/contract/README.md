# x.x.nft

```shell
npx hardhat help

// test
npx hardhat test

// test with gas report
REPORT_GAS=true npx hardhat test

// contract deployment on testnet
npx hardhat run scripts/deploy.ts --network fuji

// batch mint on testnet (set contract address and to addresses before execution)
npx hardhat run scripts/batchMint.ts --network fuji

// check set tokenURI on hardhat
npx hardhat run scripts/testCall.ts --network hardhat

```

## NFT mint operation

Set address in `script/batchMint.ts`.

```
npx hardhat run script/batchMint.ts --network [networkName]
npx hardhat run scripts/requestVRF.ts --network [networkName]
npx hardhat run scripts/setMetadata.ts --network [networkName]
```