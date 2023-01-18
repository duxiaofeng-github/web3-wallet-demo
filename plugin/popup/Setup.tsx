import React from "react";
import { Navigate } from "react-router-dom";
import { paths } from "./routes";
import { globalStore } from "./store";
import "./setup.css";
import { Button, Form, Input, Typography } from "antd";
import { useWallet } from "./use-wallet";
import browser from "webextension-polyfill";
import { BackgroundEvent } from "../event";

export const Setup: React.FunctionComponent = () => {
  const wallet = useWallet();

  if (wallet) {
    return <Navigate to={paths.home} />;
  }

  async function submit(privateKey: string) {
    globalStore.update((store) => {
      store.privateKey = privateKey;
    });

    await browser.runtime.sendMessage({
      method: BackgroundEvent.SetPrivateKey,
      detail: privateKey,
    });
  }

  return (
    <div className="setup-container">
      <Typography.Title level={2} className="title">
        Wallet Setup
      </Typography.Title>
      <Typography.Paragraph type="secondary" className="desc">
        You need to enter your wallet private key to enable this plugin
      </Typography.Paragraph>
      <Form
        onFinish={({ privateKey }) => {
          submit(privateKey);
        }}
      >
        <Form.Item
          name="privateKey"
          rules={[
            // we should do a validator here to check if the privateKey is valid later
            { required: true, message: "Private key is required" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
