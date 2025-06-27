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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem
          "react-vendor": ["react", "react-dom"],

          // TanStack libraries
          "tanstack-vendor": ["@tanstack/react-query", "@tanstack/react-router"],

          // Web3 libraries - these are often the largest
          "web3-core": ["@web3-onboard/core", "@web3-onboard/react"],
          "web3-wallets": ["@web3-onboard/injected-wallets"],
          "arbitrum-sdk": ["@arbitrum/sdk"],

          // UI Component libraries
          "radix-vendor": [
            "@radix-ui/react-checkbox",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tooltip",
          ],

          // Form libraries
          "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],

          // Utility libraries
          "utils-vendor": [
            "clsx",
            "class-variance-authority",
            "tailwind-merge",
            "date-fns",
            "lucide-react",
          ],

          // Notification/UI libraries
          "ui-vendor": ["sonner", "next-themes"],
        },
        // Optimize chunk naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId;
          if (facadeModuleId) {
            // For dynamic imports, use a shorter name
            const fileName = path.basename(facadeModuleId, path.extname(facadeModuleId));
            return `assets/${fileName}-[hash].js`;
          }
          return "assets/[name]-[hash].js";
        },
      },
    },
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Optimize bundle splitting
    target: "es2020",
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minify options
    minify: "esbuild",
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@tanstack/react-query",
      "@tanstack/react-router",
      "clsx",
      "lucide-react",
    ],
    exclude: [
      // Exclude large libraries that should be loaded dynamically
      "@web3-onboard/core",
      "@arbitrum/sdk",
    ],
  },
});
