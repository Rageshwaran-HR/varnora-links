import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import { insertLinkSchema, insertCompanyInfoSchema } from "../shared/schema";
import { ZodError } from "zod";
import { setupAuth } from "./auth";

export const registerRoutes = (app: Express) => {
    // Set up authentication
    setupAuth(app);

    // API routes
    app.get("/api/health", (req, res) => {
        res.json({ status: "ok", time: new Date().toISOString() });
    });

    app.get("/api/links", (req, res) => {
        res.json({ message: "Links endpoint" });
    });

    app.get("/api/company-info", (req, res) => {
        res.json({ message: "Company Info endpoint" });
    });

    app.get("/api/user", (req, res) => {
        res.json({ message: "User endpoint" });
    });

    // Other routes...
};

const ignoreConfig = {
  "ignore": ["*.log", "node_modules/", "dist/"]
};
