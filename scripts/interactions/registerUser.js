require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const { ethers } = require("ethers");
const contractABI = [
  "function getOwner() public view returns (address)",
  "function setPublicKey(string userId, bytes publicKey) public",
  "function isUserRegistered(string userId) public view returns (bool)"
];

async function registerUser(userId, publicKeyText) {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, signer);
    
    // Check if the user is authorized
    const currentOwner = await contract.getOwner();
    const signerAddress = await signer.getAddress();
    
    if (signerAddress.toLowerCase() !== currentOwner.toLowerCase()) {
      console.error("Unauthorized: Only the owner can set public keys.");
      return;
    }
    
    // First check if user is already registered to avoid the transaction error
    const isRegistered = await contract.isUserRegistered(userId);
    if (isRegistered) {
      console.error(`Error: User ID '${userId}' is already registered.`);
      return;
    }
    
    const publicKeyBytes = ethers.toUtf8Bytes(publicKeyText);
    
    // Proceed with registration if user doesn't exist
    const tx = await contract.setPublicKey(userId, publicKeyBytes);
    await tx.wait();
    console.log(`Registered userId: ${userId} with publicKey: ${publicKeyText}`);
  } catch (error) {
    // Extract and display the reason from the error if available
    if (error.reason) {
      console.error(`Error: ${error.reason}`);
    } else if (error.message && error.message.includes("User ID already registered")) {
      console.error("Error: User ID already registered.");
    } else {
      console.error("Error occurred during registration:", error.message || error);
    }
  }
}

registerUser("tut", "aksjd").catch(console.error);