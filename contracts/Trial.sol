// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@account-abstraction/contracts/core/EntryPoint.sol";

import "@account-abstraction/contracts/interfaces/IAccount.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

import "@openzeppelin/contracts/utils/Create2.sol";

contract Trial {
    address public owner;
    string private entityName;
    uint private entityAge;

    constructor(address _owner) {
        owner = _owner;
    }

    function updateName(string memory newName) public {
        entityName = newName;
    }

    function updateAge(uint newAge) public {
        entityAge = newAge;
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

    function getEntityDetails()
        public
        view
        returns (string memory name, uint age, address entityOwner)
    {
        return (entityName, entityAge, owner);
    }
}

contract TrialFactory {
    // Trial[] public assessments;

    // event AssessmentCreated(
    //     address indexed assessmentAddress,
    //     address indexed owner
    // );

    // function createAccount(address _owner) external returns (address) {
    //     // amount salt bytecode

    //     bytes32 salt = bytes32(uint256(uint160(_owner)));
    //     bytes memory bytecode = abi.encodePacked(
    //         type(Trial).creationCode,
    //         abi.encode(_owner)
    //     );

    //     address addr = Create2.computeAddress(salt, keccak256(bytecode));

    //     if (addr.code.length > 0) {
    //         return addr;
    //     }
    //     return deploy(salt, bytecode);
    // }

    // function deploy(
    //     bytes32 salt,
    //     bytes memory bytecode
    // ) internal returns (address addr) {
    //     require(bytecode.length != 0, "Create2: bytecode length us zero");
    //     assembly {
    //         addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
    //     }

    //     require(addr != address(0), "Create2: Failed on deploy");
    // }

    function createAccount(address _owner) external returns (address) {
        Trial acc = new Trial(_owner);
        return address(acc);
    }
}
