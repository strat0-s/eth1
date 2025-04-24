const { ethers, upgrades } = require("hardhat");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

async function main() {
    const KeyManager = await ethers.getContractFactory("KeyManager");
    
    const keyManager = await upgrades.deployProxy(KeyManager, [process.env.OWNER_ADDRESS], {
        initializer: "initialize",
    });

    await keyManager.waitForDeployment();

    console.log("KeyManager deployed at:", await keyManager.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
