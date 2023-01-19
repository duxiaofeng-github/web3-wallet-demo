import browser from "webextension-polyfill";
import { Event } from "./event";

console.log("content script loaded");

function dispatchEvent(name: Event, detail: any) {
  document.dispatchEvent(
    new CustomEvent(name, {
      detail,
    })
  );
}

function listenToDomEvent() {
  document.addEventListener(Event.Request, function (e) {
    if ("detail" in e) {
      console.log("request", e.detail);
      const { method, params, id } = e.detail as any;

      if (method && params && id) {
        browser.runtime
          .sendMessage({
            method: Event.Request,
            detail: {
              id,
              method,
              params,
            },
          })
          .then((result) => {
            dispatchEvent(Event.Response, { id, jsonrpc: "2.0", result });
          })
          .catch((error) => {
            dispatchEvent(Event.ResponseError, {
              id,
              jsonrpc: "2.0",
              message: error.toString(),
              code: -1, // we need to implement the error handler here later
            });
          });
      }
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
