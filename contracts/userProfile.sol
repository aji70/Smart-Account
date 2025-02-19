// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@account-abstraction/contracts/core/EntryPoint.sol";

import "@account-abstraction/contracts/interfaces/IAccount.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

import "@openzeppelin/contracts/utils/Create2.sol";

contract UserProfile {
    address public owner;

    struct Profile {
        string name;
        uint256 age;
        string email;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    mapping(address => Profile) private profiles;
    event ProfileCreated(
        address indexed user,
        string name,
        uint256 age,
        string email
    );
    event ProfileDeleted(address indexed user);

    function setProfile(
        string memory _name,
        uint256 _age,
        string memory _email
    ) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_age > 0, "Age must be greater than 0");
        require(bytes(_email).length > 0, "Email cannot be empty");

        profiles[msg.sender] = Profile(_name, _age, _email);
        emit ProfileCreated(msg.sender, _name, _age, _email);
    }

    function getProfile(
        address _user
    ) public view returns (string memory, uint256, string memory) {
        require(
            bytes(profiles[_user].name).length > 0,
            "Profile does not exist"
        );
        Profile memory profile = profiles[_user];
        return (profile.name, profile.age, profile.email);
    }

    function deleteProfile(address _user) public {
        require(
            msg.sender == _user,
            "Unauthorized: You can only delete your own profile"
        );
        require(
            bytes(profiles[_user].name).length > 0,
            "Profile does not exist"
        );

        delete profiles[_user];
        emit ProfileDeleted(_user);
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
}

contract UserProfileFactory {
    function createAccount(address _owner) external returns (address) {
        // amount salt bytecode

        bytes32 salt = bytes32(uint256(uint160(_owner)));
        bytes memory bytecode = abi.encodePacked(
            type(UserProfile).creationCode,
            abi.encode(_owner)
        );

        address addr = Create2.computeAddress(salt, keccak256(bytecode));

        if (addr.code.length > 0) {
            return addr;
        }
        return deploy(salt, bytecode);
    }

    function deploy(
        bytes32 salt,
        bytes memory bytecode
    ) internal returns (address addr) {
        require(bytecode.length != 0, "Create2: bytecode length us zero");
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
        }

        require(addr != address(0), "Create2: Failed on deploy");
    }
}
