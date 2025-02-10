const hre = require("hardhat");

const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const FACTORY_NONCE = 1;

const FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

async function main() {
  // Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
  // Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
  //Create: hash(deployer + nonce)

  const sender = await hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  });
  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);
  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");

  const [signer0, signer1, signer2, signer3] = await hre.ethers.getSigners();

  // const signature = signer0.signMessage(
  //   hre.ethers.getBytes(hre.ethers.id("wee"))
  // );

  const address0 = await signer0.getAddress();
  const initCode = "0x";
  // FACTORY_ADDRESS +
  // AccountFactory.interface
  //   .encodeFunctionData("createAccount", [address0])
  //   .slice(2);
  console.log("sender", { sender }); //smart Account address 0xCafac3dD18aC6c6e92c921884f9E4176737C052c

  // await entryPoint.depositTo(PM_ADDRESS, {
  //   value: hre.ethers.parseEther("100"),
  // });

  const Account = await hre.ethers.getContractFactory("Account");

  const userOp = {
    sender, //deployer address smart account address
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 400_000,
    verificationGasLimit: 400_000,
    preVerificationGas: 100_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
    paymasterAndData: PM_ADDRESS,
    signature: "0x",
  };

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = signer0.signMessage(hre.ethers.getBytes(userOpHash));

  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();

  console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
