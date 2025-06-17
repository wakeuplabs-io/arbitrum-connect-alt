import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      verboseFileRoutes: false,
    }),
    react(),
    tsconfigPaths(),
  ] as any,
  // optimizeDeps: {
  //   include: ["ethers", "@web3-onboard/react", "@arbitrum/sdk"],
  // },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         "web3-libs": ["ethers", "@web3-onboard/react", "@web3-onboard/core"],
  //         "arbitrum-sdk": ["@arbitrum/sdk"],
  //         vendor: ["react", "react-dom", "@tanstack/react-query"],
  //       },
  //     },
  //   },
  // },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
});
