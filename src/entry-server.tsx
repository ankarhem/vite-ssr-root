import App from "./App";
import { renderToString } from "react-dom/server";

interface RenderOptions {}

export const render = (options: RenderOptions) => {
  return renderToString(<App />);
};
renderToString(<App />);
