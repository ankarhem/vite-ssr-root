import React, { Suspense, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import "./index.css";
import Button from "./components/Button";

const LazyButton = React.lazy(() => {
  return Promise.all([
    import("./components/Button"),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]).then(([moduleExports]) => moduleExports);
});

function App() {
  return (
    <>
      <nav>
        <a href="/">Home</a>
      </nav>
      <div className="App">
        <Suspense fallback={"Loading Button..."}>
          <LazyButton label={"Lazy Button (3000ms)"} />
        </Suspense>
        <Button label={"Static button"}></Button>
      </div>
    </>
  );
}

export default App;
