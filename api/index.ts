import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import { registerRoutes } from "./routes";
import serverless from "serverless-http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register API routes
await registerRoutes(app);

// Static file serving if needed
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

// For production, export the handler for serverless
export const handler = serverless(app);

// Add local server for development
if (process.env.NODE_ENV === "development") {
    const PORT = 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

