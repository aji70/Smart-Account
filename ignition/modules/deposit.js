const hre = require("hardhat");

const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

const PM_ADDRESS = "0x46bf71dB52dEc091b7C1d2790B9D920033EF5ae7";

async function main() {
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  await entryPoint.depositTo(PM_ADDRESS, {
    value: hre.ethers.parseEther(".2"),
  });

  console.log("deposit was successful");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
