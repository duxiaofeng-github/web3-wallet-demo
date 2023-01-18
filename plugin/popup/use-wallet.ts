import { useRexContext } from "@jimengio/rex";
import { useMemo } from "react";
import { IStore } from "./store";
import { getWallet } from "./utils";

export function useWallet() {
  const { privateKey } = useRexContext((store: IStore) => store);

  const wallet = useMemo(() => {
    if (!privateKey) {
      return undefined;
    }

    return getWallet(privateKey);
  }, [privateKey]);

  return wallet;
}
