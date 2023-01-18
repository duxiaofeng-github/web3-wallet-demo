import React from "react";
import { render } from "react-dom";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { RexProvider } from "@jimengio/rex";

const router = createHashRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/sendTransaction",
    element: <div>Hello world2!</div>,
  },
]);

function renderApp() {
  render(
    <React.StrictMode>
      <RexProvider value={globalStore}>
        <RouterProvider router={router} />
      </RexProvider>
    </React.StrictMode>,
    document.getElementById("container")
  );
}

renderApp();
