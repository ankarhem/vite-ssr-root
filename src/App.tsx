import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import "./index.css";
import Button from "./components/Button";

function App() {
  return (
    <>
      <nav>
        <a href="/">Home</a>
      </nav>
      <div className="App">
        <Button />
      </div>
    </>
  );
}

export default App;
