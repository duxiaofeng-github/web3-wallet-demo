import { ethers } from "ethers";
import { globalStore } from "./store";

export function clearAndClose() {
  globalStore.update((store) => {
    store.pendingRequest = undefined;
  });

  window.close();
}

let wallet: ethers.Wallet;

export function getRpcProvider() {
  return new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/polygon_mumbai",
    80001
  );
}

export function getWallet(privateKey: string) {
  if (wallet && wallet.privateKey === privateKey) {
    return wallet;
  }

  wallet = new ethers.Wallet(privateKey, getRpcProvider());

  return wallet;
}
