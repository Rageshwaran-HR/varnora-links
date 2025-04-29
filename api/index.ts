import express from "express";
import cors from "cors";
import { createServer as createHttpServer } from "http";
import { fileURLToPath } from "url";
import path from "path";
import { registerRoutes } from "./routes"; // Adjusted import path for your routes
import serverless from "serverless-http"; // For serverless export, if needed later

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
await registerRoutes(app);

// Static file serving if needed (uncomment if necessary)
app.use(express.static(path.join(__dirname, "..", "client", "dist"))); 

// For production, export the handler for serverless
// export const handler = serverless(app);  // Uncomment only if deploying to Vercel or another serverless platform

// Dev: Ensure the server keeps running
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});

export default server;
