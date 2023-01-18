import browser from "webextension-polyfill";
import { Event } from "./event";

console.log("content script loaded");

function listenToDomEvent() {
  document.addEventListener(Event.Request, function (e) {
    if ("detail" in e) {
      browser.runtime.sendMessage({
        method: Event.Request,
        detail: e.detail,
      });
    }
  });
}

function injectScript(file: string) {
  const script = document.createElement("script");

  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file);
  document.body.appendChild(script);

  console.log("injected");
}

injectScript(browser.runtime.getURL("inject.js"));
listenToDomEvent();
