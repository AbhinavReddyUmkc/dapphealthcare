/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.27",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0xc9b0bad7876aa7c6a39f51979ea8095b18b6481ce2c7e8f863ef582313d89fe7", // Private key 2
        "0xaf0c209acebe11b150a4dfbfd2b4bd2f7ac8b969185ee50a7ddc4d7455861d81"  // Private key 1
      ],
    },
  },
};
