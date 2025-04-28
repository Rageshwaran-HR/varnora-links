import express, { Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import cors from "cors";
import path from "path";
import 'dotenv/config';  // To load environment variables

import { registerRoutes } from "./routes";  // Your routes will be imported here
import { fileURLToPath } from "url";  // To resolve __dirname in ES modules

// This workaround manually defines __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);

const app = express();

// Middleware setup
app.use(cors());  // Allow requests from other domains (CORS)
app.use(express.json());  // To parse JSON request bodies
app.use(express.urlencoded({ extended: false }));  // For form submissions

// API call logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine); // Use console.log for Vercel logs
    }
  });

  next();
});

// Register the routes
(async () => {
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Serve static frontend build in production
  const staticPath = path.join(__dirname, "public");  // Ensure public folder exists
  console.log("Serving static from", staticPath);
  app.use(express.static(staticPath));

  // Catch-all: serve index.html for client-side routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // Start the server
  const port = process.env.PORT || 5000;  // Port can be set from .env
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
