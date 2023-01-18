import React from "react";
import { render } from "react-dom";
import { RouterProvider } from "react-router-dom";
import { RexProvider } from "@jimengio/rex";
import { globalStore } from "./store";
import { paths, router } from "./routes";

import "antd/dist/reset.css";
import { Event, InternalRpcMethods } from "../event";
import browser from "webextension-polyfill";
import { Guard } from "./guard";

function renderApp() {
  render(
    <React.StrictMode>
      <RexProvider value={globalStore}>
        <Guard render={() => <RouterProvider router={router} />} />
      </RexProvider>
    </React.StrictMode>,
    document.getElementById("container")
  );
}

renderApp();

async function handleMessage(message: any) {
  console.log("popup on message", message);
  const { method, detail } = message || {};
  const { id: rpcId, method: rpcMethod, params: rpcParams } = detail || {};

  if (
    method &&
    rpcMethod &&
    typeof method === "string" &&
    typeof rpcMethod === "string"
  ) {
    switch (method) {
      case Event.Request:
        return new Promise<any>((resolve, reject) => {
          const { pendingRequest, privateKey } = globalStore.getState();

          if (pendingRequest) {
            // we only accept one request at one time for now
            pendingRequest.reject(new Error("request canceled"));
          }

          if (!privateKey) {
            reject(new Error("wallet haven't setup"));

            return;
          }

          globalStore.update((store) => {
            store.pendingRequest = {
              rpcId,
              rpcMethod,
              rpcParams,
              resolve,
              reject,
            };
          });

          switch (rpcMethod) {
            case InternalRpcMethods.PersonalSign:
            case InternalRpcMethods.EthSign:
            case InternalRpcMethods.EthSignTransaction:
              router.navigate(paths.sign);
              break;
            case InternalRpcMethods.EthSendtransaction:
              router.navigate(paths.sendTransaction);
              break;
          }
        });
    }
  }

  return true;
}

browser.runtime.onMessage.addListener(handleMessage);
