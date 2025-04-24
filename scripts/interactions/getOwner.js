require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const { ethers } = require("ethers");

const abi = [
  "function getOwner() public view returns (address)"
];

async function getOwner() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, provider);
  
  const owner = await contract.getOwner();
  console.log("Current Owner:", owner);
}

getOwner().catch(console.error);