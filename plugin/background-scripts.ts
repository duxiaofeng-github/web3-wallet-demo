import browser from "webextension-polyfill";
import { Event } from "./event";

async function handleMessage(
  message: any,
  sender: browser.Runtime.MessageSender
) {
  console.log(sender);
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
        await browser.browserAction.setPopup({ popup: "popup.html" });
        await browser.browserAction.openPopup();
        break;
    }
  }
}

browser.runtime.onMessage.addListener(handleMessage);
