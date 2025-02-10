// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AAModule", (m) => {
  const ep = m.contract("EntryPoint");
  const af = m.contract("AccountFactory");
  const pm = m.contract("Paymaster");

  return { ep, af, pm };
});
