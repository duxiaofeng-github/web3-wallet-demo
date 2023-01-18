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
      <Guard
        render={() => (
          <RexProvider value={globalStore}>
            <RouterProvider router={router} />
          </RexProvider>
        )}
      />
    </React.StrictMode>,
    document.getElementById("container")
  );
}

renderApp();

async function handleMessage(message: any) {
  const { method, detail } = message || {};
  const { method: rpcMethod, params: rpcParams } = detail || {};

  if (
    method &&
    rpcMethod &&
    typeof method === "string" &&
    typeof rpcMethod === "string"
  ) {
    switch (method) {
      case Event.Request:
        globalStore.update((store) => {
          store.rpcParams = rpcParams;
        });

        switch (rpcMethod) {
          case InternalRpcMethods.EthSign:
            router.navigate(paths.sign);
            break;
          case InternalRpcMethods.EthSendtransaction:
            router.navigate(paths.sendTransaction);
            break;
        }
        break;
    }
  }
}

browser.runtime.onMessage.addListener(handleMessage);
