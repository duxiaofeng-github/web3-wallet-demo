import { ethers } from "ethers";
import browser from "webextension-polyfill";
import { BackgroundEvent, Event } from "./event";

let privateKey = "";
let wallet: ethers.Wallet;

async function handleMessage(message: any) {
  const { method, detail } = message || {};

  if (method && typeof method === "string") {
    switch (method) {
      case Event.Request:
        await browser.browserAction.setPopup({ popup: "popup.html" });
        await browser.browserAction.openPopup();

        const resp = await browser.runtime.sendMessage(message);

        return resp;
      case BackgroundEvent.SetPrivateKey:
        privateKey = detail;

        return;
      case BackgroundEvent.GetPrivateKey:
        return privateKey;
    }
  }
}

browser.runtime.onMessage.addListener(handleMessage);
