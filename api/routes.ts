import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import { insertLinkSchema, insertCompanyInfoSchema } from "@shared/schema";
import { ZodError } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API endpoints for links
  app.get("/api/links", async (req, res) => {
    try {
      const links = await storage.getLinks();
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve links" });
    }
  });

  app.get("/api/links/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const link = await storage.getLink(id);
      
      if (!link) {
        return res.status(404).json({ error: "Link not found" });
      }
      
      res.json(link);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve link" });
    }
  });

  app.post("/api/links", async (req, res) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const linkData = insertLinkSchema.parse(req.body);
      const link = await storage.createLink(linkData);
      res.status(201).json(link);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create link" });
    }
  });

  app.put("/api/links/:id", async (req, res) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const link = await storage.getLink(id);
      
      if (!link) {
        return res.status(404).json({ error: "Link not found" });
      }
      
      const updatedLink = await storage.updateLink(id, req.body);
      res.json(updatedLink);
    } catch (error) {
      res.status(500).json({ error: "Failed to update link" });
    }
  });

  app.delete("/api/links/:id", async (req, res) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLink(id);
      
      if (!success) {
        return res.status(404).json({ error: "Link not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete link" });
    }
  });

  // API endpoints for company info
  app.get("/api/company-info", async (req, res) => {
    try {
      const info = await storage.getCompanyInfo();
      res.json(info);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve company info" });
    }
  });

  app.put("/api/company-info", async (req, res) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const updatedInfo = await storage.updateCompanyInfo(req.body);
      res.json(updatedInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to update company info" });
    }
  });

  // API endpoints for appearance settings
  app.get("/api/appearance", async (req, res) => {
    try {
      const settings = await storage.getAppearance();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve appearance settings" });
    }
  });

  app.put("/api/appearance", async (req, res) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const updatedSettings = await storage.updateAppearance(req.body);
      res.json(updatedSettings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update appearance settings" });
    }
  });

  // Create an HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
