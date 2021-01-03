# MOOMASK

MooMask is a browser extension wallet for BSC. We don't save the private key in our server. The private key is stored locally in the browser and encrypted. For safety, always logout your wallet after using it.

## Features
* Generate a new wallet.
* Import wallet from private key.
* Export private key.
* View BNB and Peggy Token balances.
* View wallet address with the QR code.
* View recent transactions.
* Send & receive BNB and Peggy Tokens.
* Switch the network between Mainnet and Testnet.
## Build Extension

* Install [node.js](https://nodejs.org/) and npm.
* Install dependencies :
  ```
  npm install
  ```
* Build the project :
  ```
  npm run build
  ```
* Uncompressed build can be found in `/dist` folder.
* Go to Chrome Extensions page and activate the Developer Mode.
* Click `Load Unpacked` button and point it to `/dist` folder.

## Development
* Install [node.js](https://nodejs.org/) and npm.
* Install dependencies :
  ```
  npm install
  ```
* Run the project :
  ```
  npm run dev
  ```
* Go to Chrome Extensions page and activate the Developer Mode.
* Click `Load Unpacked` button and point it to `/dist` folder, the extension will be autoreloading as you change the codes.

## Tech
* This wallet is built with [Vue.js](https://vuejs.org/).
