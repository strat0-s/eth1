
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("KeyManagerModule", (m) => {
    const KeyManager = m.contract("KeyManager", []);
    return {KeyManager};
});