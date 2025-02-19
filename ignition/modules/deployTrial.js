// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("UserProfileFactoryModule", (m) => {
  const af = m.contract("UserProfileFactory");
  const pm = m.contract("Paymaster");
  const ep = m.contract("EntryPoint");

  return { af, pm, ep };
});
