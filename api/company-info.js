import { storage } from "../storage";
import { insertCompanyInfoSchema } from "../shared/schema";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const info = await storage.getCompanyInfo();
      res.status(200).json(info);
    } catch {
      res.status(500).json({ error: "Failed to retrieve company info" });
    }
  } else if (req.method === "PUT") {
    try {
      const data = insertCompanyInfoSchema.parse(req.body);
      const updated = await storage.updateCompanyInfo(data);
      res.status(200).json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update company info" });
    }
  } else {
    res.status(405).end();
  }
}
