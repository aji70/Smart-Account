// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

// const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const hre = require("hardhat");

async function main() {
  const [signer0] = await hre.ethers.getSigners();

  const signature = signer0.signMessage("wee");

  const Test = await hre.ethers.getContractFactory("Test");

  const test = await Test.deploy();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// module.exports = buildModule("TestModule", (m) => {
//   const test = m.contract("Test");

//   return { test };
// });
