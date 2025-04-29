import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";  // Required for ES Modules

// Get the current file URL and derive the directory name
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

// Ensure __dirname is valid
if (!__dirname) {
  throw new Error("Failed to resolve __dirname");
}

// Resolve staticPath dynamically (make sure 'some-directory' exists and is correct)
const staticPath = path.resolve(__dirname, "some-directory");
if (!staticPath) {
  throw new Error("Static path is undefined");
}

console.log("Resolved path:", path.resolve(__dirname, "client", "src"));

export default defineConfig(async () => {
  const plugins = [
    react(), // React plugin for Vite
    runtimeErrorOverlay(), // Error overlay plugin
    // Conditionally import cartographer plugin if necessary
    ...(process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [
          (await import("@replit/vite-plugin-cartographer")).cartographer(),
        ]
      : []),
  ];

  return {
    plugins,
    resolve: {
      alias: {
        // Aliases for easier imports
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"), // Set the root directory to client
    build: {
      outDir: path.resolve(__dirname, "dist"), // Build output directory
      emptyOutDir: true, // Clear the dist directory before building
    },
    server: {
      proxy: {
        '/api': 'http://localhost:5000', // Proxy API requests to the backend server
      },
    },
  };
});
