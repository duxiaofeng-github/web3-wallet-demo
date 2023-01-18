import { createStore } from "@jimengio/rex";

export interface ILoadingOptions<T> {
  data?: T;
  loading?: boolean;
  error?: Error | boolean;
  retry?: () => void;
}

export interface IStore {
  privateKey?: string;
}

export const initialStore: IStore = {};

export const globalStore = createStore<IStore>(initialStore);
