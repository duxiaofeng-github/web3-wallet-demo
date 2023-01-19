import { useRexContext } from "@jimengio/rex";
import { Button, Typography } from "antd";
import { ethers } from "ethers";
import React from "react";
import { Navigate } from "react-router-dom";
import { InternalRpcMethods } from "../event";
import { paths } from "./routes";
import { IStore } from "./store";
import { useSubmission } from "./use-submission";
import { useWallet } from "./use-wallet";
import { clearAndClose } from "./utils";
import "./sign.css";

function parseMessage(rpcMethod: string, rpcParams: any) {
  const message =
    rpcMethod === InternalRpcMethods.PersonalSign
      ? rpcParams[0]
      : rpcMethod === InternalRpcMethods.EthSign
      ? rpcMethod[1]
      : rpcMethod === InternalRpcMethods.EthSignTransaction
      ? JSON.stringify(rpcMethod)
      : undefined;

  if (ethers.utils.isHexString(message)) {
    return ethers.utils.toUtf8String(message);
  } else {
    return message;
  }
}

export const Sign: React.FunctionComponent = () => {
  const wallet = useWallet();
  const { pendingRequest } = useRexContext((store: IStore) => store);
  const { triggerer, submitting } = useSubmission(async () => {
    if (pendingRequest && wallet) {
      try {
        if (
          pendingRequest.rpcMethod === InternalRpcMethods.EthSignTransaction
        ) {
          const signed = await wallet.signTransaction(pendingRequest.rpcParams);

          pendingRequest.resolve(signed);
        } else {
          const message = parseMessage(
            pendingRequest.rpcMethod,
            pendingRequest.rpcParams
          );

          if (message) {
            const signed = await wallet.signMessage(message);

            pendingRequest.resolve(signed);
          } else {
            pendingRequest.reject(new Error("invalid params"));
          }
        }
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
    <div className="sign-container">
      <Typography.Title level={2}>
        Sign{" "}
        {pendingRequest.rpcMethod === InternalRpcMethods.EthSign ||
        pendingRequest.rpcMethod === InternalRpcMethods.PersonalSign
          ? "Message"
          : pendingRequest.rpcMethod === InternalRpcMethods.EthSignTransaction
          ? "Transaction"
          : ""}
      </Typography.Title>
      <Typography.Text type="secondary">
        {`${
          pendingRequest.rpcMethod === InternalRpcMethods.EthSign ||
          pendingRequest.rpcMethod === InternalRpcMethods.PersonalSign
            ? "Message:"
            : pendingRequest.rpcMethod === InternalRpcMethods.EthSignTransaction
            ? "Transaction data:"
            : "Data"
        } ${parseMessage(pendingRequest.rpcMethod, pendingRequest.rpcParams)}`}
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
          Sign
        </Button>
      </div>
    </div>
  ) : null;
};
