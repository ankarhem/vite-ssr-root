import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { splitVendorChunkPlugin } from "vite";
import { UserConfig } from "vite";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  const config: UserConfig = {
    plugins: [
      react({
        fastRefresh: isDevelopment,
      }),
      splitVendorChunkPlugin(),
    ],
    build: {
      rollupOptions: {},
    },
  };

  return config;
});
