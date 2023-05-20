
# Sequence diagrams

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant DB
    participant Blockchain
    Client ->> API: Request to get materials
    API ->> DB: Request to create a session
    DB ->> DB: Create a session
    DB -->> Client: Session ID, Random message
    Client ->> Client: Sign a random message
    Client ->> API: SessionId, Signature
    API ->> DB: Fetch Random Message by sessionID
    DB -->> API: Random Message
    API ->> API: Validate a signature and recover address
    API ->> Blockchain: Check if the recovered address holds NFTs
    alt Non NFT holder
      Blockchain -->> API: Return balance zero
      API -->> Client: Error message
    else NFT Holder
      Blockchain -->> API: Return balance
      API ->> DB: Fetch secret materials
      DB -->> Client: Secret materials
    end

```

## Google Cloud Console
- Activate IAM API
  - https://console.cloud.google.com/flows/enableapi?apiid=iam.googleapis.com&redirect=https://console.cloud.google.com
- Create service account and generate key
  - grant access of firebase
  - https://cloud.google.com/iam/docs/creating-managing-service-account-keys

# References
- rainbowkit nextjs-13 upgrade
  - https://normad.hashnode.dev/rainbowkit-nextjs-13-upgrade
- Hardhat Boilerplate Project
  - https://hardhat.org/tutorial/boilerplate-project
- React Truffle Box¶
  - https://trufflesuite.com/boxes/react/
- I should understand more about Next 13
  - The "use client" directive
    - https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive
- wagmi
  - https://wagmi.sh/core/getting-started
- viem
  - https://viem.sh/docs/getting-started.html
- routing
  - https://nextjs.org/docs/app/building-your-application/routing
- Route Handlers
  - https://nextjs.org/docs/app/building-your-application/routing/router-handlers
