import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from "vite";
import liveReload from "vite-plugin-live-reload";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const config = {
    plugins: [
      react(),
      splitVendorChunkPlugin(),
      liveReload(["src/**/*", "./server.ts", "./index.html"]),
    ],
    server: {
      hmr: false,
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
        },
      },
    },
  };

  if (mode !== "development") {
    const HASH = env.COMMIT_HASH || "";
    if (!HASH) {
      throw new Error("No COMMIT_HASH provided");
    }
    config.build.rollupOptions.output = {
      entryFileNames: `assets/${HASH}/[name].js`,
      chunkFileNames: `assets/${HASH}/[name].js`,
      assetFileNames: `assets/${HASH}/[name].[ext]`,
    };
  }

  return config;
});
