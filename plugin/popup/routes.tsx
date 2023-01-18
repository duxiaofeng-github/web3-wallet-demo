import React from "react";
import { createHashRouter } from "react-router-dom";
import { Guard } from "./guard";
import { Home } from "./Home";
import { SendTransaction } from "./SendTransaction";
import { Setup } from "./Setup";
import { Sign } from "./Sign";

export const paths = {
  home: "/",
  setup: "/setup",
  sendTransaction: "/send-transaction",
  sign: "/sign",
};

export const router = createHashRouter([
  {
    path: paths.home,
    element: <Home />,
  },
  {
    path: paths.setup,
    element: <Setup />,
  },
  {
    path: paths.sendTransaction,
    element: <SendTransaction />,
  },
  {
    path: paths.sign,
    element: <Sign />,
  },
  {
    index: true,
    element: <Home />,
  },
]);
