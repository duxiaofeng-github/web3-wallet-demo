import React, { useState } from "react";
import { render } from "react-dom";

import "antd/dist/reset.css";
import { Button, Form, Input, notification, Typography } from "antd";
import { ethers } from "ethers";
import { useSubmission } from "./use-submission";
import "./app.css";

const App: React.FunctionComponent = () => {
  const [signedMessage, setSignedMessage] = useState<{
    message: string;
    signature: string;
  }>();
  const [signer, setSigner] = useState<string>();
  const [txHash, setTxHash] = useState<string>();
  const { triggerer: signMessage, submitting: signMessageSubmitting } =
    useSubmission(async function (message: string) {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );

      try {
        const signature = await provider.getSigner().signMessage(message);
        setSignedMessage({ message, signature });
      } catch (e) {
        notification.error({ message: (e as any).toString() });

        throw e;
      }
    });

  const { triggerer: verifyMessage, submitting: verifyMessageSubmitting } =
    useSubmission(async function (data: {
      message: string;
      signature: string;
    }) {
      const verifySigner = ethers.utils.recoverAddress(
        ethers.utils.hashMessage(data.message),
        data.signature
      );

      setSigner(verifySigner);
    });

  const { triggerer: sendTransaction, submitting: sendTransactionSubmitting } =
    useSubmission(async function (data: { to: string; value: string }) {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );

      try {
        const resp = await provider.getSigner().sendTransaction({
          to: data.to,
          value: ethers.utils.parseEther(data.value),
        });

        setTxHash(resp.hash);
      } catch (e) {
        notification.error({ message: (e as any).toString() });

        throw e;
      }
    });
  return (
    <div className="app">
      <div className="section">
        <Typography.Title level={2}>Sign Message</Typography.Title>
        <Form
          layout="vertical"
          disabled={signMessageSubmitting}
          onFinish={({ message }) => {
            signMessage(message);
          }}
        >
          <Form.Item
            label="Message"
            name="message"
            rules={[{ required: true, message: "Message is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={signMessageSubmitting}
            >
              Sign Message
            </Button>
          </Form.Item>
        </Form>
        {signedMessage ? (
          <>
            <Typography.Text type="secondary">
              {`Signature: ${signedMessage.signature}`}
            </Typography.Text>
            <Button
              block
              type="primary"
              loading={verifyMessageSubmitting}
              onClick={() => {
                verifyMessage(signedMessage);
              }}
            >
              Verify Signature
            </Button>
          </>
        ) : null}
        {signer ? (
          <Typography.Text type="secondary">
            {`Message signed by: ${signer}`}
          </Typography.Text>
        ) : null}
      </div>
      <div className="section">
        <Typography.Title level={2}>Send Transaction</Typography.Title>
        <Form
          layout="vertical"
          disabled={sendTransactionSubmitting}
          onFinish={({ to, value }) => {
            sendTransaction({ to, value });
          }}
        >
          <Form.Item
            label="To"
            name="to"
            rules={[{ required: true, message: "To is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Value"
            name="value"
            rules={[{ required: true, message: "Value is required" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={sendTransactionSubmitting}
            >
              Send Transaction
            </Button>
          </Form.Item>
        </Form>

        {txHash ? (
          <Typography.Text type="secondary">
            {`Transaction hash: ${txHash}`}
          </Typography.Text>
        ) : null}
      </div>
    </div>
  );
};

function renderApp() {
  render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("container")
  );
}

renderApp();
