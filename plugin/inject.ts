import { Event } from "./event";
import { RpcResult } from "./interface";

console.log("inject script loaded");

function dispatchEvent(name: Event, detail: any) {
  document.dispatchEvent(
    new CustomEvent(name, {
      detail,
    })
  );
}

let sequence = 0;

const promises: {
  id: number;
  resolve: (result: any) => void;
  reject: (err: any) => void;
}[] = [];

function injectEthereum() {
  if (typeof window !== undefined) {
    (window as any).ethereum = {
      request: (data: { method: string; params: any }) => {
        return new Promise<RpcResult>((resolve, reject) => {
          sequence += 1;

          promises.push({ id: sequence, resolve, reject });

          dispatchEvent(Event.Request, { ...data, id: sequence });
        });
      },
    };

    console.log((window as any).ethereum);
  }
}

function receiveResponse() {
  document.addEventListener(Event.Response, function (e) {
    if ("detail" in e) {
      console.log("Response", e.detail);
      const { id, result } = e.detail as any;

      if (id != null) {
        const index = promises.findIndex((item) => item.id === id);

        if (index !== -1) {
          const [promise] = promises.splice(index, 1);

          promise.resolve(result);
        }
      }
    }
  });
  document.addEventListener(Event.ResponseError, function (e) {
    if ("detail" in e) {
      console.log("response failed", e.detail);
      const { id, error } = e.detail as any;

      if (id != null) {
        const index = promises.findIndex((item) => item.id === id);

        if (index !== -1) {
          const [promise] = promises.splice(index, 1);

          promise.reject(error);
        }
      }
    }
  });
}

injectEthereum();
receiveResponse();
