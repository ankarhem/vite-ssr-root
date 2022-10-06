import React, { Suspense } from "react";
import { createRoutesFromElements, Outlet, Route } from "react-router-dom";
import { notFound, RootBoundary } from "./components/CustomError";

const Home = React.lazy(() => import("./pages"));
const About = React.lazy(() => import("./pages/about"));

export const routes = createRoutesFromElements(
  <>
    <Route element={<Outlet />} errorElement={<RootBoundary />}>
      <Route
        path="/"
        element={
          <Suspense fallback={"Loading home..."}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path="/about"
        element={
          <Suspense fallback={"Loading about..."}>
            <About />
          </Suspense>
        }
      />
      <Route
        path="*"
        loader={() => {
          throw notFound();
        }}
      />
    </Route>
  </>
);
