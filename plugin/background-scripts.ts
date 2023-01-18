import browser from "webextension-polyfill";

async function handleMessage() {
  await browser.browserAction.openPopup();
}

browser.runtime.onMessage.addListener(handleMessage);
