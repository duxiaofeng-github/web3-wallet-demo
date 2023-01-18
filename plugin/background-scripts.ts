import browser from "webextension-polyfill";

async function handleMessage() {
  await browser.browserAction.setPopup({ popup: "popup.html#/2" });
  await browser.browserAction.openPopup();
}

browser.runtime.onMessage.addListener(handleMessage);
