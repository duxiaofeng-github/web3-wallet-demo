import React, { ReactNode } from "react";
import "./guard.css";
import { LoadingOutlined } from "@ant-design/icons";
import useSWR from "swr";
import browser from "webextension-polyfill";
import { BackgroundEvent } from "../event";
import { globalStore } from "./store";

interface IProps {
  render: () => ReactNode;
}

export const Guard: React.FunctionComponent<IProps> = ({ render }) => {
  const { data, error } = useSWR(
    "loadPrivateKey",
    async () => {
      const privateKey = await browser.runtime.sendMessage(
        BackgroundEvent.GetPrivateKey
      );

      globalStore.update((store) => {
        store.privateKey = privateKey;
      });
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return (
    <div className="guard-container">
      {!data && !error ? (
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
