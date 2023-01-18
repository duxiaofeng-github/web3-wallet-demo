import { useRexContext } from "@jimengio/rex";
import { Button, Typography } from "antd";
import React from "react";
import { Navigate } from "react-router-dom";
import { paths } from "./routes";
import { IStore } from "./store";
import { useSubmission } from "./use-submission";
import { useWallet } from "./use-wallet";
import { clearAndClose } from "./utils";
import "./send-transaction.css";

export const SendTransaction: React.FunctionComponent = () => {
  const wallet = useWallet();
  const { pendingRequest } = useRexContext((store: IStore) => store);
  const { triggerer, submitting } = useSubmission(async () => {
    if (pendingRequest && wallet) {
      try {
        const result = await wallet.sendTransaction(pendingRequest.rpcParams);

        pendingRequest.resolve(result);
      } catch (e) {
        pendingRequest.reject(e);
      }

      clearAndClose();
    }
  });

  if (!wallet) {
    return <Navigate to={paths.setup} />;
  }

  function reject() {
    if (pendingRequest) {
      pendingRequest.reject(new Error("user cancelled"));
    }

    clearAndClose();
  }

  return pendingRequest ? (
    <div className="send-container">
      <Typography.Title level={2}>Send Transaction</Typography.Title>
      <Typography.Text type="secondary">
        {JSON.stringify(pendingRequest.rpcParams)}
      </Typography.Text>
      <div className="footer">
        <Button
          block
          onClick={() => {
            reject();
          }}
        >
          Reject
        </Button>
        <Button
          block
          type="primary"
          loading={submitting}
          onClick={() => {
            triggerer();
          }}
        >
          Send
        </Button>
      </div>
    </div>
  ) : null;
};
