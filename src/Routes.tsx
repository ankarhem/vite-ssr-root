import React from "react";
import { createRoutesFromElements, Outlet, Route } from "react-router-dom";
import { notFound, RootBoundary } from "./components/CustomError";

const Home = React.lazy(() => import("./pages"));
const About = React.lazy(() => import("./pages/about"));

export const routes = createRoutesFromElements(
  <>
    <Route element={<Outlet />} errorElement={<RootBoundary />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route
        path="*"
        loader={() => {
          throw notFound();
        }}
      />
    </Route>
  </>
);
