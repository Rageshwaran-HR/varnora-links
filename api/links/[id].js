import { storage } from "../../storage";

export default async function handler(req, res) {
  const id = parseInt(req.query.id);

  if (req.method === "GET") {
    try {
      const link = await storage.getLink(id);
      if (!link) return res.status(404).json({ error: "Link not found" });
      res.status(200).json(link);
    } catch {
      res.status(500).json({ error: "Failed to retrieve link" });
    }
  } else if (req.method === "PUT") {
    try {
      const updated = await storage.updateLink(id, req.body);
      res.status(200).json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update link" });
    }
  } else if (req.method === "DELETE") {
    try {
      const success = await storage.deleteLink(id);
      if (!success) return res.status(404).json({ error: "Link not found" });
      res.status(204).end();
    } catch {
      res.status(500).json({ error: "Failed to delete link" });
    }
  } else {
    res.status(405).end();
  }
}
