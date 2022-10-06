import App from "./App";
import { renderToPipeableStream } from "react-dom/server";
import { Writable } from "stream";
import { ServerRenderFunction } from "./server-types";

const ABORT_TIMEOUT = 5000;

export const render: ServerRenderFunction = async ({ req, res, template }) => {
  let didError = false;
  const [start, end] = template.split("<!--ssr-outlet-->");

  const stream = new Writable({
    write(chunk, _encoding, cb) {
      res.write(chunk, cb);
    },
    final() {
      res.end(end);
    },
  });

  const { abort, pipe } = renderToPipeableStream(<App />, {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader("Content-type", "text/html");
      res.write(start);
      pipe(stream);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.
      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  });

  setTimeout(abort, ABORT_TIMEOUT);
};
