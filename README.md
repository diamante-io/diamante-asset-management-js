# NFT Minting Diamante 

This project allows users to connect their Diamante wallet and mint NFTs by uploading an image and providing an asset name. The project consists of a frontend interface and a backend server to handle the NFT minting process.

## Installation

Node.js and npm installed on your machine.
 Diamante wallet extension installed in your browser.[WALLET](https://chromewebstore.google.com/detail/diam-wallet/oakkognifoojdbfjaccegangippipdmn?hl=en) check here 

```bash
Npm install
```

## Start the backend server
```bash
node index.mjs
```
The backend server is built using Express.js and handles the following tasks:

1 - Uploading the image to IPFS.

2 - Creating the NFT metadata.

3 - Building XDR for transaction for minting the NFT on Diamante Blockchain.

Endpoints

POST /CreateNft: Accepts a file and metadata to create an NFT.


## Frontend Interface

Open `index.html` in your browser to access the frontend interface.
Alternatively, you can use a live server to serve the frontend files.


## Steps

- Click the `Connect Wallet` button to connect your Diamante wallet.

- Upload an image and enter an asset name.

- Click the `Submit` button to mint the NFT.

- Your wallet will be opened to complete the transaction.

- In your Display  you can CID  copy that if you want to check correct image your uploading or not 
```bash
https://browseipfs.diamcircle.io/ipfs/{Past-your-CID}
```

## Check NFT 

You can check yours NFTs in Your Wallet in Assets.

