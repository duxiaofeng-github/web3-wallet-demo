import React from "react";
import { createHashRouter } from "react-router-dom";
import { Home } from "./Home";
import { Setup } from "./Setup";

export const paths = {
  home: "/",
  setup: "setup",
  sendTransaction: "send-transaction",
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
    element: <div>Hello world2!</div>,
  },
  {
    index: true,
    element: <Home />,
  },
]);
