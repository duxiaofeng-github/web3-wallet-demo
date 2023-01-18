import { useRexContext } from "@jimengio/rex";
import { ethers } from "ethers";
import { useMemo } from "react";
import { IStore } from "./store";

export function useWallet() {
  const { privateKey } = useRexContext((store: IStore) => store);

  const wallet = useMemo(() => {
    if (!privateKey) {
      return undefined;
    }

    const rpcProvider = new ethers.providers.JsonRpcProvider(
      "https://rpc.ankr.com/polygon_mumbai",
      80001
    );

    return new ethers.Wallet(privateKey, rpcProvider);
  }, [privateKey]);

  return wallet;
}
