# Summary
With this script, we send automated transactions in union bridge per 30 seconds

#

## This script is specifically designed for stress testing one of the top zk-interoperability protocols, and it serves no other purpose

#

# Make sure:
* You have enough `ETH` on Arbitrum Sepolia: [Bridge](https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia&l2ChainId=23011913&sourceChain=sepolia)
* You have enough `BERA` on berachain bArtio testnet: [faucet](https://bartio.faucet.berachain.com/)
* You have enough `UNO` on berachain bArtio testnet & Arbitrum Sepolia: [Bridge](https://app.union.build/transfer)


# Step 1- Create Hex
1- Transfer a small amount 0.000003257 (anything but low) of `UNO` from `Arbitrum Sepolia` and `bArtio` to Union

https://app.union.build/transfer

2- Copy and save the hex of the transactions of the both `Arbitrum Sepolia` and `bArtio` in the explorer

![Screenshot_192](https://github.com/user-attachments/assets/3929009a-29ba-46a0-876a-5dcc8aab587a)
![Screenshot_193](https://github.com/user-attachments/assets/0a3b8869-93f5-436d-993c-206797359beb)
![Screenshot_194](https://github.com/user-attachments/assets/9bc8aa7e-8c82-4bc9-bc89-b0fe3edf299e)
![Screenshot_195](https://github.com/user-attachments/assets/621bd1a1-6303-49b3-9e76-2cb8cbc8cfea)
![Screenshot_196](https://github.com/user-attachments/assets/41d32b9f-4768-42c7-9d59-e49a2df9d1bc)

# Step 2- Run script

### Install git & nodejs
```console
sudo apt update && sudo apt upgrade -y
sudo apt install git screen
```
```console
# Check Nodejs Version
node --version
# if 18, skip nodejs steps

# Delete Nodejs old files
sudo apt-get remove nodejs
sudo apt-get purge nodejs
sudo apt-get autoremove
sudo rm /etc/apt/keyrings/nodesource.gpg
sudo rm /etc/apt/sources.list.d/nodesource.list

# Install Nodejs 18
NODE_MAJOR=18
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings

curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

sudo apt-get update
sudo apt-get install -y nodejs
node --version

# Install npm
sudo apt-get install npm
npm --version

# Install yarn
curl -sSL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update -y
sudo apt-get install yarn -y
```

### Config Script
```console
npm install web3 readline-sync

git clone https://github.com/0xmoei/union-testnet
cd union-testnet
```

### Run Script
```console
# Start a screen
screen -S union

# Run
node union.js
```

Script asks you the network you want to transact on ,wallet privatekey ,and the hex you created in step 1

![Screenshot_197](https://github.com/user-attachments/assets/b000b809-8a6a-4ee0-9c40-d0fe8942aab7)

> Check txs here
> 
> https://app.union.build/explorer/transfers

* to minimize screen= `Ctrl+A+D` 
* to kill script= command: `screen -XS union quit`

#

I will add more routes and networks

#

## This script is specifically designed for stress testing one of the top zk-interoperability protocols, and it serves no other purpose
