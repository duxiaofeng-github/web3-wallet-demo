import React from "react";
import { render } from "react-dom";

import "antd/dist/reset.css";
import { Button, Form } from "antd";
import { ethers } from "ethers";

const App: React.FunctionComponent = () => {
  async function signMessage() {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );

    const signed = await provider.getSigner().signMessage("aaa");

    console.log(signed);
  }

  return (
    <div>
      <Form>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              signMessage();
            }}
          >
            SignMessage
          </Button>
        </Form.Item>
      </Form>
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
