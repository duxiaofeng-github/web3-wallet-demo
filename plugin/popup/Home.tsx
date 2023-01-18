import { useRexContext } from "@jimengio/rex";
import React from "react";
import { Navigate } from "react-router-dom";
import { paths } from "./routes";
import { IStore } from "./store";

export const Home: React.FunctionComponent = () => {
  const { privateKey } = useRexContext((store: IStore) => store);

  if (!privateKey) {
    return <Navigate to={paths.home} />;
  }

  return null;
};
