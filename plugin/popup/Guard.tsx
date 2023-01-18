import React, { ReactNode } from "react";
import "./guard.css";
import { LoadingOutlined } from "@ant-design/icons";
import useSWR from "swr";
import browser from "webextension-polyfill";
import { BackgroundEvent } from "../event";
import { globalStore, IStore } from "./store";
import { useRexContext } from "@jimengio/rex";

interface IProps {
  render: () => ReactNode;
}

export const Guard: React.FunctionComponent<IProps> = ({ render }) => {
  const { privateKeyLoaded } = useRexContext((store: IStore) => store);
  const { error } = useSWR(
    "loadPrivateKey",
    async () => {
      console.log("loadPrivateKey");

      const privateKey = await browser.runtime.sendMessage({
        method: BackgroundEvent.GetPrivateKey,
      });

      globalStore.update((store) => {
        store.privateKey = privateKey;
        store.privateKeyLoaded = true;
      });
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return (
    <div className="guard-container">
      {!privateKeyLoaded ? (
        <div className="loading">
          <LoadingOutlined />
        </div>
      ) : error ? (
        <div className="error">Load wallet error.</div>
      ) : (
        render()
      )}
    </div>
  );
};
