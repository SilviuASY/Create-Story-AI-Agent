const StoryAgent = require('./agent');

// Create an instance of the agent
const agent = new StoryAgent();

(async () => {
  // 1. Get the current block number
  const blockNumber = await agent.getBlockNumber();
  console.log(`Agent Name: ${agent.agentName}`);
  console.log(`Current block number: ${blockNumber}`);

  // 2. Example API request with parameters
  const apiParams = {
    module: 'account', // Example: module for accounts
    action: 'balance', // Example: action to get balance
    address: 'Your_Address', // Example Ethereum address
    tag: 'latest' // Latest balance
  };

  const apiData = await agent.fetchDataFromAPI(apiParams);
  if (apiData) {
    console.log('API Data:', apiData);
  } else {
    console.log('Failed to fetch API data.');
  }

  // 3. Example of sending a transaction
  const toAddress = 'Recipient_Address'; // Replace with the actual recipient's address
  const value = '0.001'; // The amount of IP to send

  const txHash = await agent.sendTransaction(toAddress, value);
  if (txHash) {
    console.log('Transaction Hash:', txHash);
  } else {
    console.log('Transaction failed.');
  }
})();
