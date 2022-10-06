import { SharedTree } from "./App";
import { renderToPipeableStream } from "react-dom/server";
import { Writable } from "stream";
import type { ServerRenderFunction } from "./server-types";
import {
  unstable_createStaticRouter as createStaticRouter,
  unstable_StaticRouterProvider as StaticRouterProvider,
} from "react-router-dom/server";
import { unstable_createStaticHandler as createStaticHandler } from "@remix-run/router";
import type * as express from "express";
import { routes } from "./Routes";
import {
  dehydrate,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const ABORT_TIMEOUT = 5000;

export const render: ServerRenderFunction = async ({ req, res, template }) => {
  /** React router */
  let { query } = createStaticHandler(routes);
  let remixRequest = createFetchRequest(req);
  let context = await query(remixRequest);

  if (context instanceof Response) {
    throw context;
  }
  let router = createStaticRouter(routes, context);

  /** Tanstack query */
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    ["catfact"],
    async () =>
      await fetch("https://catfact.ninja/fact").then((res) => res.json())
  );
  const dehydratedState = dehydrate(queryClient);

  /** React streaming */
  let didError = false;
  const [start, end] = template.split("<!--ssr-outlet-->");

  const stream = new Writable({
    write(chunk, _encoding, cb) {
      res.write(chunk, cb);
    },
    final() {
      const tackstackScriptTag = `<script>window.__REACT_QUERY_STATE__ = ${JSON.stringify(
        dehydratedState
      )};</script>`;
      res.end(end.replace("<!--tanstack-query-->", tackstackScriptTag));
      queryClient.clear();
    },
  });

  const { abort, pipe } = renderToPipeableStream(
    <SharedTree>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
          <StaticRouterProvider
            router={router}
            context={context}
            nonce="some-generated-nonce"
          />
        </Hydrate>
      </QueryClientProvider>
    </SharedTree>,
    {
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
    }
  );

  setTimeout(abort, ABORT_TIMEOUT);
};

export function createFetchHeaders(
  requestHeaders: express.Request["headers"]
): Headers {
  let headers = new Headers();

  for (let [key, values] of Object.entries(requestHeaders)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  return headers;
}

export function createFetchRequest(req: express.Request): Request {
  let origin = `${req.protocol}://${req.get("host")}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  let url = new URL(req.originalUrl || req.url, origin);

  let controller = new AbortController();

  req.on("close", () => {
    controller.abort();
  });

  let init: RequestInit = {
    method: req.method,
    headers: createFetchHeaders(req.headers),
    signal: controller.signal,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
  }

  return new Request(url.href, init);
}
