# union-testnet

Transfer a small amount of UNO from sepolia to Union [here](https://app.union.build/transfer) 
![Screenshot_1](https://github.com/user-attachments/assets/7f69bab3-cfc9-4473-90e4-47603124c9bd)

```
const Web3 = require('web3');
const readline = require('readline');

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt user for input
rl.question('Enter your private key (hex string without 0x prefix): ', (privateKey) => {
  if (!privateKey.startsWith('0x')) {
    privateKey = '0x' + privateKey;
  }

  rl.question('Enter the hex string to send: ', (hexString) => {
    if (!hexString.startsWith('0x')) {
      hexString = '0x' + hexString;
    }

    rl.question('Enter the interval in seconds for sending transactions: ', (interval) => {
      const intervalSeconds = parseInt(interval, 10);

      // Setup web3 instance
      const web3 = new Web3('https://rpc.sepolia.org');
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      web3.eth.accounts.wallet.add(account);
      web3.eth.defaultAccount = account.address;

      // Function to send transaction
      const sendTransaction = async () => {
        const tx = {
          to: '0xD0081080Ae8493cf7340458Eaf4412030df5FEEb',
          value: '0',
          data: hexString,
          gas: 21000, // Set the gas limit for 0 ETH transaction
        };

        try {
          const receipt = await web3.eth.sendTransaction(tx);
          console.log('Transaction sent! Receipt:', receipt);
        } catch (error) {
          console.error('Error sending transaction:', error);
        }
      };

      // Start sending transactions at specified intervals
      sendTransaction(); // Send first transaction immediately
      setInterval(sendTransaction, intervalSeconds * 1000);

      rl.close();
    });
  });
});
```
