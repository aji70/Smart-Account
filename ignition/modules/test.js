const hre = require("hardhat");

const ACCOUNT_ADDRESS = "0xc358e86d0d1d27b892698d63784670518dd023df";

async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDRESS);
  // const code = await hre.ethers.provider.getCode(EP_ADDRESS);

  // console.log("code = ", code);

  const count = await account.count();

  console.log("count =", count);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
