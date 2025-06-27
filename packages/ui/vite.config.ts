import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      verboseFileRoutes: false,
    }),
    react(),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    include: [
      "@web3-onboard/react",
      "@web3-onboard/core",
      "@web3-onboard/injected-wallets",
      "@arbitrum/sdk",
      "ethers",
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "web3-libs": [
            "ethers",
            "@web3-onboard/react",
            "@web3-onboard/core",
            "@web3-onboard/injected-wallets",
          ],
          "arbitrum-sdk": ["@arbitrum/sdk"],
          react: ["react", "react-dom"],
          tanstack: ["@tanstack/react-query", "@tanstack/react-router"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
});
