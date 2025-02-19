require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sep",
  networks: {
    sep: {
      url: process.env.ALCHEMY_SEPOLIA_API_KEY_URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
};
