import { ethers } from "ethers";
import browser from "webextension-polyfill";
import { BackgroundEvent, Event, InternalRpcMethods } from "./event";

let privateKey = "";
let wallet: ethers.Wallet;

function getRpcProvider() {
  return new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/polygon_mumbai",
    80001
  );
}

function getWallet(privateKey: string) {
  if (wallet && wallet.privateKey === privateKey) {
    return wallet;
  }

  wallet = new ethers.Wallet(privateKey, getRpcProvider());

  return wallet;
}

async function openPopup() {
  await browser.browserAction.setPopup({ popup: "popup.html" });
  try {
    await browser.browserAction.openPopup();
  } catch (e) {}
}

async function handleMessage(message: any) {
  const { method, detail } = message || {};
  const { method: rpcMethod, params: rpcParams } = detail || {};

  if (method && typeof method === "string") {
    switch (method) {
      case Event.Request:
        console.log("background request", message.detail);

        if (typeof rpcMethod === "string") {
          switch (rpcMethod) {
            case InternalRpcMethods.EthAccounts:
              if (!privateKey) {
                await openPopup();

                throw new Error("wallet haven't setup");
              }

              const address = getWallet(privateKey).address;

              return [address];
            case InternalRpcMethods.PersonalSign:
            case InternalRpcMethods.EthSign:
            case InternalRpcMethods.EthSignTransaction:
            case InternalRpcMethods.EthSendtransaction:
              console.log("background send");

              await openPopup();

              const resp = await browser.runtime.sendMessage(message);

              console.log("background resp", resp);

              return resp;
            default:
              return getRpcProvider().send(rpcMethod, rpcParams);
          }
        }

      case BackgroundEvent.SetPrivateKey:
        privateKey = detail;

        console.log("privateKey set");

        return;
      case BackgroundEvent.GetPrivateKey:
        console.log("privateKey return");

        return privateKey;
    }
  }
}

browser.runtime.onMessage.addListener(handleMessage);
