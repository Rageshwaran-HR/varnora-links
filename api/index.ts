import { Express } from "express";
import linksRoutes from "./links";
import companyInfoRoutes from "./company-info";

export async function registerRoutes(app: Express) {
  app.use("/api/links", linksRoutes);
  app.use("/api/company-info", companyInfoRoutes);

  // Add other routes here
}