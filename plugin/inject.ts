import { Event } from "./event";

console.log("inject script loaded");

function dispatchEvent(name: Event, detail: any) {
  document.dispatchEvent(
    new CustomEvent(name, {
      detail,
    })
  );
}

function injectEthereum() {
  if (typeof window !== undefined) {
    (window as any).ethereum = {
      request: (method: string, params: any | any[]) => {
        dispatchEvent(Event.Request, { method, params });
      },
    };

    console.log((window as any).ethereum);
  }
}

injectEthereum();
