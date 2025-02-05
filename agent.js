const { ethers } = require('ethers');
const fetch = require('node-fetch'); // Added for compatibility
const querystring = require('querystring'); // Added for creating the query string
const config = require('./config.json');

class StoryAgent {
  constructor() {
    this.privateKey = config.privateKey;
    this.rpcUrl = config.rpcUrl;
    this.apiUrl = config.apiUrl;
    this.agentName = config.agentName;

    // Connect to the network using RPC
    this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl);
    this.wallet = new ethers.Wallet(this.privateKey, this.provider);
  }

  async getBlockNumber() {
    return await this.provider.getBlockNumber();
  }

  async fetchDataFromAPI(params) {
    try {
      // Add parameters to the query string
      const query = querystring.stringify(params); 
      const url = `${this.apiUrl}?${query}`;

      // Send the GET request with the correct headers
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-CHAIN': '1516', // Network ID
          'X-API-Key': '4CWuPKSRTTxC7WvjPNsaZlAqJmrGL7OhNniUrZawdu8' // API Key
        }
      });

      const data = await response.json();
      console.log('API Response:', data); // For debugging

      return data;
    } catch (error) {
      console.error('Error fetching API data:', error);
      return null;
    }
  }

  async sendTransaction(to, value) {
    try {
      // Check if the recipient's address is valid
      if (!ethers.utils.isAddress(to)) {
        throw new Error('Invalid Ethereum address');
      }

      console.log(`Sending ${value} IP to ${to}...`);

      // Send the transaction
      const tx = await this.wallet.sendTransaction({
        to: to,
        value: ethers.utils.parseEther(value),
        gasLimit: 21000, // Set a standard gas limit for transactions
        gasPrice: await this.provider.getGasPrice() // Get the current gas price
      });

      console.log(`Transaction sent! Hash: ${tx.hash}`);
      await tx.wait();
      console.log(`Transaction confirmed! Hash: ${tx.hash}`);

      return tx.hash;
    } catch (error) {
      console.error('Transaction failed:', error);
      return null;
    }
  }
}

module.exports = StoryAgent;
