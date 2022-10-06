import React, { Suspense } from "react";
import { CatFact } from ".";
import { useQuery } from "@tanstack/react-query";

const CatFactComponent = () => {
  const query = useQuery<CatFact>(
    ["catfact-not-ssr-cached"],
    async () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            fetch("https://catfact.ninja/fact").then((res) => res.json())
          );
        }, 1000);
      }) as any,
    { suspense: true }
  );

  return (
    <>
      <button
        onClick={() => query.refetch()}
        disabled={query.fetchStatus === "fetching"}
      >
        {query.fetchStatus === "fetching" ? "Fetching..." : "Refetch"}
      </button>
      {query.fetchStatus === "fetching" ? <div>Loading cat fact...</div> : null}
      {query.isError ? <div>Error loading cat fact</div> : null}
      {query.fetchStatus === "idle" && query.data ? (
        <div style={{ maxWidth: "50ch" }}>{query.data.fact}</div>
      ) : null}
    </>
  );
};

function CatFactPage() {
  return (
    <>
      <div style={{ paddingBottom: "1rem" }}>SSR'd Cat fact (1000ms)</div>
      <Suspense fallback={"Suspense inside the catfact page"}>
        <CatFactComponent />
      </Suspense>
    </>
  );
}

export default CatFactPage;
