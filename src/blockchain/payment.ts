import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";

export async function payWithCrypto(orderId: string, ethAmount: number) {
  try {
    if (typeof window === "undefined") {
      return { error: "Server environment" };
    }

    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      alert("MetaMask not installed");
      return { error: "no_wallet" };
    }

    const provider = new ethers.BrowserProvider(ethereum);
    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();

    // ✅ Connect to contract
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const value = ethers.parseEther(String(ethAmount));

    // 🔥 CALL SMART CONTRACT
    const tx = await contract.pay(orderId, {
      value,
    });

    console.log("TX sent:", tx.hash);

    const receipt = await tx.wait();

    console.log("Confirmed:", receipt.hash);

    return {
      txHash: tx.hash,
      orderId,
      status: "success",
    };
  } catch (err) {
    console.error(err);

    return {
      error: "payment_failed",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}