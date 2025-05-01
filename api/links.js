import { storage } from "../path-to/storage";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const links = await storage.getLinks();
      res.status(200).json(links);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve links" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
