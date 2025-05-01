import { Router } from "express";
import { storage } from "../lib/storage.ts";

const router = Router();

// Get company info
router.get("/", async (req, res) => {
  try {
    const info = await storage.getCompanyInfo();
    res.json(info);
  } catch (error) {
    console.error("Error retrieving company info:", error);
    res.status(500).json({ error: "Failed to retrieve company info" });
  }
});

// Update company info
router.put("/", async (req, res) => {
  // Check if user is authenticated
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const updatedInfo = await storage.updateCompanyInfo(req.body);
    res.json(updatedInfo);
  } catch (error) {
    console.error("Error updating company info:", error);
    res.status(500).json({ error: "Failed to update company info" });
  }
});

export default router;