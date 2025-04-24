require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const { ethers } = require("ethers");

const abi = [
  "function getPublicKey(string userId) view returns (bytes)",
  "function updatePublicKey(string userId, bytes newPublicKey) external"
];

async function updateUser(userId, newPublicKey) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

  try {
    const newPublicKeyBytes = ethers.toUtf8Bytes(newPublicKey);

    let currentPublicKey;
    try {
      currentPublicKey = await contract.getPublicKey(userId);
    } catch (err) {
      throw new Error("User ID does not exist.");
    }

    if (ethers.hexlify(currentPublicKey) === ethers.hexlify(newPublicKeyBytes)) {
      console.log(`Public key for '${userId}' is already up to date.`);
      return;
    }

    const tx = await contract.updatePublicKey(userId, newPublicKeyBytes);
    await tx.wait();
    console.log(`Public key for '${userId}' updated successfully.`);
  } catch (error) {
    const errorMessage = error?.error?.message || error?.reason || error?.message;

    if (errorMessage && errorMessage.includes("User ID is not registered")) {
      throw new Error("User ID does not exist.");
    }

    console.error(`Error updating public key for ${userId}. ${error}`);
  }
}

updateUser("tut", "nigamtest").catch(console.error);
