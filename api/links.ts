import { Router } from "express";
import { storage } from "./storage";
import { insertLinkSchema } from "../shared/schema";
import { ZodError } from "zod";

const router = Router();

// Get all links
router.get("/", async (req, res) => {
  try {
    const links = await storage.getLinks();
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve links" });
  }
});

// Get a specific link by ID
router.get("/:id", async (req, res) => {
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

// Create a new link
router.post("/", async (req, res) => {
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

// Update a link
router.put("/:id", async (req, res) => {
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

// Delete a link
router.delete("/:id", async (req, res) => {
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

export default router;