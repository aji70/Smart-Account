const hre = require("hardhat");

const ACCOUNT_ADDRESS = "0x9acbe4629f61e09b386bfd6e7c7c572abb6a680a";

const usersProfile = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

async function main() {
  const account = await hre.ethers.getContractAt(
    "UserProfile",
    ACCOUNT_ADDRESS
  );
  // const code = await hre.ethers.provider.getCode(EP_ADDRESS);

  // console.log("code = ", code);

  const count = await account.getProfile(usersProfile);

  console.log("user: ", count);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
