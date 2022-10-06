import { Link } from "react-router-dom";
import React, { Suspense } from "react";
import Button from "../components/Button";
const LazyButton = React.lazy(() => {
  return Promise.all([
    import("../components/Button"),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]).then(([moduleExports]) => moduleExports);
});
function About() {
  return (
    <>
      <h2>About</h2>
      <div>Lazy loading components</div>
      <Button label={"Normal Button"} />
      <Suspense fallback={<div>Loading button...</div>}>
        <LazyButton label={"Lazy Button (3000ms)"} />
      </Suspense>
    </>
  );
}

export default About;
