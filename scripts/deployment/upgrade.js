const { ethers, upgrades } = require("hardhat");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

async function main() {
    const existingAddress = process.env.CONTRACT_ADDRESS;

    const KeyManagerV3 = await ethers.getContractFactory("KeyManagerV3");
    const upgraded = await upgrades.upgradeProxy(existingAddress, KeyManagerV3);

    console.log("Contract upgraded at:", await upgraded.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});