require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const { ethers } = require("ethers");

const abi = [
  "function transferOwnership(address newOwner) public",
  "function getOwner() public view returns (address)"
];

async function transferOwnership(newOwnerAddress) {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

    // Get current owner to verify authorization
    const currentOwner = await contract.getOwner();
    const signerAddress = await signer.getAddress();
    
    if (signerAddress.toLowerCase() !== currentOwner.toLowerCase()) {
      console.error("Unauthorized: Only the current owner can transfer ownership.");
      return;
    }

    if (newOwnerAddress.toLowerCase() === currentOwner.toLowerCase()) {
      console.error("Alert: The address provided is already the current owner. No transfer needed.");
      return;
    }

    const tx = await contract.transferOwnership(newOwnerAddress);
    await tx.wait();
    console.log(`Ownership transferred to: ${newOwnerAddress}`);
  } catch (error) {
    if (error.reason) {
      console.error(`Error: ${error.reason}`);
    } else {
      console.error("Error transferring ownership:", error.message || error);
    }
  }
}

transferOwnership("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266").catch(console.error);