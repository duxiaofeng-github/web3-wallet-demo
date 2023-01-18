import React from "react";
import { Navigate } from "react-router-dom";
import { paths } from "./routes";
import { globalStore } from "./store";
import "./setup.css";
import { Button, Form, Input, Typography } from "antd";
import { useWallet } from "./useWallet";

export const Setup: React.FunctionComponent = () => {
  const wallet = useWallet();

  if (wallet) {
    return <Navigate to={paths.home} />;
  }

  function submit(privateKey: string) {
    globalStore.update((store) => {
      store.privateKey = privateKey;
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
        <Button block type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};
