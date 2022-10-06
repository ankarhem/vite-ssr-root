import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SharedTree } from "./App";
import { routes } from "./Routes";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const router = createBrowserRouter(routes);

const dehydratedState = (window as any)?.__REACT_QUERY_STATE__;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 minutes
      staleTime: 1000 * 60 * 5,
    },
  },
});

ReactDOM.hydrateRoot(
  document.querySelector("#root")!,
  <SharedTree>
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  </SharedTree>
);
