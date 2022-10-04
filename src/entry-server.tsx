import App from "./App";
import * as ReactDOMServer from "react-dom/server";

interface RenderOptions {}

export const render = (options: RenderOptions) => {
  return ReactDOMServer.renderToString(<App />);
};
