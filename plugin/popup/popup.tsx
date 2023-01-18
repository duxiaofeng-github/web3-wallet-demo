import React from "react";
import { render } from "react-dom";
import { RouterProvider } from "react-router-dom";
import { RexProvider } from "@jimengio/rex";
import { globalStore } from "./store";
import { router } from "./routes";

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
