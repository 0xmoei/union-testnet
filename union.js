const Web3 = require('web3');
const readline = require('readline');

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Network configurations
const networks = {
  '1': {
    name: 'Arbitrum Sepolia',
    rpc: 'https://sepolia-rollup.arbitrum.io/rpc',
    address: '0xBd346331b31f8C43CC378286Bfe49f2f7F128c39'
  },
  '2': {
    name: 'Berachain bArtion Testnet',
    rpc: 'https://bartio.rpc.berachain.com/',
    address: '0x6F270608fB562133777AF0f71F6386ffc1737C30'
  }
};

// Prompt user for network selection
rl.question('Select the network(s) to send transactions to (1: Arbitrum Sepolia, 2: Berachain bArtion Testnet, 3: All): ', (networkSelection) => {
  const selectedNetworks = networkSelection.split(',').map(choice => choice.trim());
  const prompts = [];

  // Validate selection and prepare prompts
  selectedNetworks.forEach(choice => {
    if (choice === '3') {
      Object.keys(networks).forEach(key => {
        prompts.push({ network: networks[key], prompt: `Enter the hex string to send for ${networks[key].name}: ` });
      });
    } else if (networks[choice]) {
      prompts.push({ network: networks[choice], prompt: `Enter the hex string to send for ${networks[choice].name}: ` });
    }
  });

  if (prompts.length === 0) {
    console.error('Invalid selection. Please choose a valid option.');
    rl.close();
    return;
  }

  // Prompt user for private key
  rl.question('Enter your private key (hex string without 0x prefix): ', (privateKey) => {
    if (!privateKey.startsWith('0x')) {
      privateKey = '0x' + privateKey;
    }

    // Function to handle hex prompts recursively
    const handleHexPrompts = (index = 0, hexStrings = {}) => {
      if (index >= prompts.length) {
        // Setup web3 instances and send transactions
        const sendTransactions = async () => {
          const nonces = {}; // Track nonces for each network

          while (true) { // Infinite loop to keep sending transactions
            for (const { network, prompt } of prompts) {
              const web3 = new Web3(network.rpc);
              const account = web3.eth.accounts.privateKeyToAccount(privateKey);
              web3.eth.accounts.wallet.add(account);
              web3.eth.defaultAccount = account.address;

              if (!nonces[network.name]) {
                nonces[network.name] = await web3.eth.getTransactionCount(account.address, 'latest');
              }

              // Function to send transaction
              const sendTransaction = async () => {
                const tx = {
                  to: network.address,
                  value: '0',
                  data: hexStrings[network.name],
                  gas: 170000, // Set the gas limit to 170000
                  nonce: nonces[network.name]++
                };

                if (network.name === 'Berachain bArtion Testnet') {
                  tx.maxFeePerGas = web3.utils.toWei('0.002', 'gwei'); // Set max base fee to 0.002 Gwei
                  tx.maxPriorityFeePerGas = web3.utils.toWei('0.002', 'gwei'); // Set priority fee to 0.002 Gwei
                } else if (network.name === 'Arbitrum Sepolia') {
                  tx.maxFeePerGas = web3.utils.toWei('0.1', 'gwei'); // Increase max base fee to 0.1 Gwei
                  tx.maxPriorityFeePerGas = web3.utils.toWei('0.1', 'gwei'); // Increase priority fee to 0.1 Gwei
                } else {
                  tx.maxFeePerGas = web3.utils.toWei('2', 'gwei'); // Set max base fee to 2 Gwei
                  tx.maxPriorityFeePerGas = web3.utils.toWei('1', 'gwei'); // Set priority fee to 1 Gwei
                }

                try {
                  const receipt = await web3.eth.sendTransaction(tx);
                  // Log the success status and network name
                  console.log(`Transaction on ${network.name} was ${receipt.status ? 'successful' : 'unsuccessful'}`);
                } catch (error) {
                  console.error(`Error sending transaction on ${network.name}: ${error.message}`); // Log the error message
                }
              };

              await sendTransaction(); // Send transaction immediately
              await new Promise(resolve => setTimeout(resolve, 30000)); // Wait for 30 seconds before the next transaction
            }
          }
        };

        // Start sending transactions
        sendTransactions();

        rl.close();
      } else {
        const { network, prompt } = prompts[index];
        rl.question(prompt, (hexString) => {
          if (!hexString.startsWith('0x')) {
            hexString = '0x' + hexString;
          }
          hexStrings[network.name] = hexString;
          handleHexPrompts(index + 1, hexStrings);
        });
      }
    };

    handleHexPrompts();
  });
});
