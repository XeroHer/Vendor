import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);

  try {
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0];
  } catch (err: any) {
    if (err.code === 4001) {
      console.log("User rejected connection");
    }
    return null;
  }
}