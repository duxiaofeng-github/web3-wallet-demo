import { useRexContext } from "@jimengio/rex";
import React from "react";
import { Navigate } from "react-router-dom";
import { paths } from "./routes";
import { IStore } from "./store";
import "./setup.css";
import { Input, Typography } from "antd";

export const Setup: React.FunctionComponent = () => {
  const { privateKey } = useRexContext((store: IStore) => store);

  if (privateKey) {
    return <Navigate to={paths.home} />;
  }

  return (
    <div className="setup-container">
      <Typography.Title>Wallet Setup</Typography.Title>
      <Input />
    </div>
  );
};
