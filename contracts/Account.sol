// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@account-abstraction/contracts/core/EntryPoint.sol";

import "@account-abstraction/contracts/interfaces/IAccount.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

import "hardhat/console.sol";

contract Test {
    constructor(bytes memory sig) {
        address recovered = ECDSA.recover(
            MessageHashUtils.toEthSignedMessageHash(keccak256("wee")),
            sig
        );
        console.log(recovered);
    }
}

contract Account is IAccount {
    uint public count;
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256
    ) external view returns (uint256 validationData) {
        address recovered = ECDSA.recover(
            MessageHashUtils.toEthSignedMessageHash(userOpHash),
            userOp.signature
        );
        return owner == recovered ? 0 : 1;
    }

    function execute() external {
        count++;
    }
}

contract AccountFactory {
    function createAccount(address _owner) external returns (address) {
        Account acc = new Account(_owner);
        return address(acc);
    }
}
