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

// check percentage of rare on hardhat
npx hardhat run scripts/testRare.ts --network hardhat


```
