import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SharedTree } from "./App";
import { routes } from "./Routes";

const router = createBrowserRouter(routes);

ReactDOM.hydrateRoot(
  document.querySelector("#root")!,
  <SharedTree>
    <RouterProvider router={router} />
  </SharedTree>
);
