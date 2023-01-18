import { createStore } from "@jimengio/rex";

export interface ILoadingOptions<T> {
  data?: T;
  loading?: boolean;
  error?: Error | boolean;
  retry?: () => void;
}

export interface IStore {
  privateKey?: string;
  privateKeyLoaded?: boolean;
  pendingRequest?: {
    rpcId: string;
    rpcMethod: string;
    rpcParams: any;
    resolve: (result: any) => void;
    reject: (err: any) => void;
  };
}

export const initialStore: IStore = {};

export const globalStore = createStore<IStore>(initialStore);
