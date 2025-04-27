import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url"; // Add this import

const __filename = fileURLToPath(import.meta.url); // Get the current file URL
const __dirname = path.dirname(__filename); // Derive the directory name

if (!__dirname) {
  throw new Error("Failed to resolve __dirname");
}

const staticPath = path.resolve(__dirname, "some-directory");
if (!staticPath) {
  throw new Error("Static path is undefined");
}

console.log("Resolved path:", path.resolve(__dirname, "client", "src"));

export default defineConfig(async () => {
  const plugins = [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [
          // Dynamically import this only when needed
          (await import("@replit/vite-plugin-cartographer")).cartographer(),
        ]
      : []),
  ];

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
  };
});
