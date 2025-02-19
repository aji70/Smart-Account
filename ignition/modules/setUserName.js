const hre = require("hardhat");

const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

const FACTORY_ADDRESS = "0x9CCb4AfC5646c95413a78F712fd330e4E06ce368";

const PM_ADDRESS = "0x46bf71dB52dEc091b7C1d2790B9D920033EF5ae7";

async function main() {
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
  const UserProfileFactory = await hre.ethers.getContractFactory(
    "UserProfileFactory"
  );

  const [signer0] = await hre.ethers.getSigners();

  const address0 = await signer0.getAddress();

  let initCode =
    FACTORY_ADDRESS +
    UserProfileFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2);
  let sender;
  try {
    await entryPoint.getSenderAddress(initCode);
  } catch (ex) {
    sender = "0x" + ex.data.slice(-40);
  }

  const code = await ethers.provider.getCode(sender);

  if (code !== "0x") {
    initCode = "0x";
  }
  console.log("sender", { sender }); //smart Account

  const Account = await hre.ethers.getContractFactory("UserProfile");

  const userOp = {
    sender, //deployer address smart account address
    nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("setProfile", [
      "John Abu",
      30,
      "johnny@gmail.com",
    ]),
    paymasterAndData: PM_ADDRESS,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  };

  const { preVerificationGas, callGasLimit, verificationGasLimit } =
    await ethers.provider.send("eth_estimateUserOperationGas", [
      userOp,
      EP_ADDRESS,
    ]);
  userOp.preVerificationGas = preVerificationGas;
  userOp.callGasLimit = callGasLimit;
  userOp.verificationGasLimit = verificationGasLimit;

  const { maxFeePerGas } = await ethers.provider.getFeeData();
  userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);

  const maxPriorityFeePerGas = await ethers.provider.send(
    "rundler_maxPriorityFeePerGas"
  );

  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

  const opHash = await ethers.provider.send("eth_sendUserOperation", [
    userOp,
    EP_ADDRESS,
  ]);

  async function waitForTransaction(opHash) {
    let tries = 0;
    while (tries < 10) {
      // Retry up to 10 times (adjust as needed)
      const result = await ethers.provider.send("eth_getUserOperationByHash", [
        opHash,
      ]);

      if (result && result.transactionHash) {
        console.log("Transaction Hash:", result.transactionHash);
        return;
      }

      console.log("Waiting for transaction...");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5s before retrying
      tries++;
    }
    console.log("Transaction not found after multiple attempts.");
  }

  // Call the function after sending the UserOperation
  waitForTransaction(opHash);

  // const tx = await entryPoint.handleOps([userOp], address0);
  // const receipt = await tx.wait();

  // console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
