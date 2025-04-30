require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const { ethers } = require("ethers");

const contractABI = [
  "function deletePublicKey(string userId) public",
  "function isUserRegistered(string userId) public view returns (bool)",
  "function getOwner() public view returns (address)"
];

async function deleteUser(userId) {
  // Provider and signer setup
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_API_KEY);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, signer);

    try {
        const currentOwner = await contract.getOwner();
        console.log(`🔐 Contract owner: ${currentOwner}`);
        console.log(`🔑 Your address:   ${signer.address}`);

        const isRegistered = await contract.isUserRegistered(userId);
        console.log('userID registered ?',isRegistered);
        if (!isRegistered) {
            console.log(`User with userId "${userId}" is not registered.`);
            return;
        }

        const tx = await contract.deletePublicKey(userId);
        console.log(`⏳ Transaction sent: ${tx.hash}`);
        await tx.wait();
        console.log(`✅ User "${userId}" deleted successfully.`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    }
}

deleteUser("tut").catch(console.error);