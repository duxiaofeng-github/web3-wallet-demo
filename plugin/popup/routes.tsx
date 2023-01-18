import React from "react";
import { createHashRouter } from "react-router-dom";
import { Home } from "./Home";

export const paths = {
  home: "/",
  sendTransaction: "send-transaction",
};

export const router = createHashRouter([
  {
    path: paths.home,
    element: <Home />,
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
