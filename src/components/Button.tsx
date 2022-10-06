import React, { useState } from "react";
import classes from "./Button.module.css";

type Props = {};

function Button() {
  const [count, setCount] = useState(0);
  return (
    <button
      className={classes.button}
      onClick={() => setCount((count) => count + 1)}
    >
      count is {count}
    </button>
  );
}

export default Button;
