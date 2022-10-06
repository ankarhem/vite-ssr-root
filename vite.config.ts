import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from "vite";
import liveReload from "vite-plugin-live-reload";
import { UserConfig } from "vite";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const config: UserConfig = {
    plugins: [
      react(),
      splitVendorChunkPlugin(),
      liveReload(["src/**/*", "./server.ts", "./index.html"]),
    ],
    server: {
      hmr: false,
    },
    build: {
      rollupOptions: {},
    },
  };

  return config;
});
