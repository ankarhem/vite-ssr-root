import React, { Suspense } from "react";
import "./App.css";
import "./index.css";

interface SharedTreeProps {
  children?: React.ReactNode;
}

export function SharedTree({ children }: SharedTreeProps) {
  return <React.StrictMode>{children}</React.StrictMode>;
}
