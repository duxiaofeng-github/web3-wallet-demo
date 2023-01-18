import React from "react";
import { Navigate } from "react-router-dom";
import { paths } from "./routes";
import { useWallet } from "./useWallet";
import "./home.css";
import { Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { ethers } from "ethers";

function formatBalance(balance: ethers.BigNumber) {
  return parseFloat(ethers.utils.formatEther(balance)).toFixed(4);
}

export const Home: React.FunctionComponent = () => {
  const wallet = useWallet();

  async function fetchBalance() {
    if (wallet) {
      const balance = await wallet.getBalance();

      return balance;
    }
  }

  const { data: balance, error } = useSWR(
    [`fetch_balance_${wallet ? wallet.address : undefined}`],
    fetchBalance,
    {
      revalidateOnFocus: false,
    }
  );

  if (!wallet) {
    return <Navigate to={paths.setup} />;
  }

  return (
    <div className="home-container">
      <div className="balance-wrapper">
        <div className="balance-title">
          <Typography.Text type="secondary">Balance</Typography.Text>
        </div>

        {!balance && !error ? (
          <LoadingOutlined />
        ) : balance ? (
          <div className="balance">{`${formatBalance(balance)} Matic`}</div>
        ) : error ? (
          <div className="error">something went wrong</div>
        ) : null}
      </div>
    </div>
  );
};
