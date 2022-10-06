import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export type CatFact = {
  fact: string;
  length: string;
};

function Home() {
  const query = useQuery<CatFact>(
    ["catfact"],
    async () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            fetch("https://catfact.ninja/fact").then((res) => res.json())
          );
        }, 500);
      }) as any
  );

  return (
    <>
      <h2>Home</h2>
      <div style={{ paddingBottom: "1rem" }}>
        SSR'd Cat fact (stale while refetching)
      </div>
      <button
        onClick={() => query.refetch()}
        // This is disabled from SSR, investigate
        disabled={query.fetchStatus === "fetching"}
      >
        Refetch
      </button>
      {query.isLoading ? <div>Loading cat fact...</div> : null}
      {query.isError ? <div>Error loading cat fact</div> : null}
      {query.data ? (
        <div style={{ maxWidth: "50ch" }}>{query.data.fact}</div>
      ) : null}
    </>
  );
}

export default Home;
