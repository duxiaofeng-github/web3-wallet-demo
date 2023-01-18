import browser from "webextension-polyfill";

async function handleMessage() {
  await browser.browserAction.setPopup({ popup: "popup.html" });
  await browser.browserAction.openPopup();
}

browser.runtime.onMessage.addListener(handleMessage);
