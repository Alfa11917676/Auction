require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");
require('@openzeppelin/hardhat-upgrades');
require("solidity-coverage");
require('hardhat-deploy');
require('dotenv').config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const PRIVATE_KEY = process.env.PRIVATE_KEY || 'sample-kovan-key'
const MNEMONIC = process.env.MNEMONIC || 'sample-mnemonic'
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'etherscan-api-key'

module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      }
    }
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    binance: {
      url: `https://speedy-nodes-nyc.moralis.io/6cda61c2558b548cb31fef81/bsc/testnet`,
      accounts: [`${process.env.PRIVATE_KEY}`
      ]
    },
    ganache: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: MNEMONIC,
      }
    }
  },
  // mocha: {
  // reporter: 'eth-gas-reporter',
  // reporterOptions : { ... } // See options below
  // },
  etherscan: {
    apiKey: {
      // polygon: "YOUR_POLYGONSCAN_API_KEY",
      bscTestnet: "HKVFDYA4AR7HN7FG59Z7N73MYN1C1M98X4",
    }
  },
};
