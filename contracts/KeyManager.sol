// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract KeyManager is Initializable, OwnableUpgradeable {
    mapping(bytes32 => bytes) private publicKeys;
    mapping(bytes32 => bool) private registeredUsers;

    function initialize(address _owner) public initializer {
        __Ownable_init(_owner);
    }

    function getPublicKey(
        string memory userId
    ) public view returns (bytes memory) {
        bytes32 userIdHash = keccak256(abi.encodePacked(userId));
        return publicKeys[userIdHash];
    }

    function isUserRegistered(string memory userId) public view returns (bool) {
        bytes32 userIdHash = keccak256(abi.encodePacked(userId));
        return registeredUsers[userIdHash];
    }

    function setPublicKey(
        string memory userId,
        bytes memory publicKey
    ) public onlyOwner {
        bytes32 userIdHash = keccak256(abi.encodePacked(userId));
        require(!registeredUsers[userIdHash], "User ID already registered");
        publicKeys[userIdHash] = publicKey;
        registeredUsers[userIdHash] = true;
    }

    function getOwner() public view returns (address) {
        return owner();
    }
}
