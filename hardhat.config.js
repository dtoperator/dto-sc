require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require('dotenv').config(".env");
require("solidity-coverage");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-etherscan");




const { API_COINMARKET, PRIVAT_KEY , API_ETHERSCAN} = process.env;
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

/**require("@nomiclabs/hardhat-web3");

 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: "1000000000000000000000000"
      }
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALC_API_KEY}`,
      accounts: [PRIVAT_KEY],
      chainId: 4,
      gasPrice: 50000000000,
      gasLimit: 100000,
    },
  },
  
  gasReporter: {
    coinmarketcap: API_COINMARKET,
    currency: 'USD',
    enabled: false
  },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      rinkeby: API_ETHERSCAN
    }
  }

};
