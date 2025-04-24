require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const { ethers } = require("ethers");

const abi = [
  "function getPublicKey(string userId) public view returns (bytes)",
  "function isUserRegistered(string userId) public view returns (bool)"
];

async function getUser(userId) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);

  try {
    const isRegistered = await contract.isUserRegistered(userId);
    if (!isRegistered) {
      throw new Error(`User with userId "${userId}" does not exist.`);
    }

    const publicKeyBytes = await contract.getPublicKey(userId);
    
    if (!publicKeyBytes || publicKeyBytes.length === 0) {
      throw new Error(`Public key not found for userId "${userId}".`);
    }

    const user = {
      userId: userId,
      publicKey: publicKeyBytes
    };

    console.log(JSON.stringify(user, null, 2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

getUser("tut").catch(console.error);
