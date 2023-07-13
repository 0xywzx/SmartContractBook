# x.x.nft

```shell
npx hardhat help

// test
npx hardhat test

// test with gas report
REPORT_GAS=true npx hardhat test

// contract deployment on testnet
npx hardhat run scripts/deploy.ts --network <network-name>

// batch mint on testnet
npx hardhat run scripts/batchMint.ts --network <network-name>

// check set tokenURI on hardhat
npx hardhat run scripts/testCall.ts --network <network-name>

// execute allowTransfer
mpx hardhat run script/allowTransfers.ts --network <network-name>

// verify contract on etherscan
npx hardhat verify --network <network-name> <contract-address> "constructor argument"
```
