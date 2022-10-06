import React, { useId, useState } from "react";
import classes from "./Button.module.css";

type Props = { label: string };

function Button({ label }: Props) {
  const id = useId();
  const [count, setCount] = useState(0);
  return (
    <div className={classes.buttonWrapper}>
      <label htmlFor={id}>{label}</label>
      <button
        id={id}
        className={classes.button}
        onClick={() => setCount((count) => count + 1)}
      >
        count is {count}
      </button>
    </div>
  );
}

export default Button;
