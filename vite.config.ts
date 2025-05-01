import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

// Get the current file URL and derive the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure __dirname is valid
if (!__dirname) {
  throw new Error("Failed to resolve __dirname");
}

export default defineConfig(() => {
  const plugins = [
    react(), // React plugin for Vite
    runtimeErrorOverlay(), // Error overlay plugin
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
    root: path.resolve(__dirname, "client"), // Root directory for frontend (client)
    build: {
      outDir: path.resolve(__dirname, "client", "dist"), // Output directory for build (client/dist)
      emptyOutDir: true, // Clean output directory before building
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5000", // Ensure this matches your backend's port
          changeOrigin: true,
          secure: false,
        },
      },
      port: 3001, // Change to an available port
    },
  };
});
