import { useRexContext } from "@jimengio/rex";
import { Button, Typography } from "antd";
import React from "react";
import { Navigate } from "react-router-dom";
import { paths } from "./routes";
import { IStore } from "./store";
import { useSubmission } from "./use-submission";
import { useWallet } from "./use-wallet";
import { clearAndClose, getRpcProvider } from "./utils";
import "./send-transaction.css";
import { ethers } from "ethers";

function parseTransaction(params: any) {
  const { to, from, gasPrice, gas, nonce, data, value, ...rest } = params;

  return {
    to,
    from,
    gasPrice: gasPrice ? ethers.BigNumber.from(gasPrice).toString() : undefined,
    gasLimit: gas ? ethers.BigNumber.from(gas).toString() : undefined,
    nonce: nonce ? ethers.BigNumber.from(nonce).toString() : undefined,
    data,
    value: value ? ethers.BigNumber.from(value).toString() : undefined,
    ...rest,
  };
}

export const SendTransaction: React.FunctionComponent = () => {
  const wallet = useWallet();
  const { pendingRequest } = useRexContext((store: IStore) => store);
  const { triggerer, submitting } = useSubmission(async () => {
    if (pendingRequest && wallet) {
      try {
        const { hash } = await wallet.sendTransaction(
          parseTransaction(pendingRequest.rpcParams[0])
        );

        // follow the eth_sendTransaction standard, we just need to return the hash

        pendingRequest.resolve(hash);
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
        {`Transaction data: ${JSON.stringify(
          parseTransaction(pendingRequest.rpcParams[0])
        )}`}
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
