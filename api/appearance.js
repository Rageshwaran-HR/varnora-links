import { storage } from "../storage";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const appearance = await storage.getAppearance();
      res.status(200).json(appearance);
    } catch {
      res.status(500).json({ error: "Failed to retrieve appearance" });
    }
  } else if (req.method === "PUT") {
    try {
      const updated = await storage.updateAppearance(req.body);
      res.status(200).json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update appearance" });
    }
  } else {
    res.status(405).end();
  }
}
