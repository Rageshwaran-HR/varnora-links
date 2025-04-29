import { createServer } from "http";
import app from "./server";
import { VercelRequest, VercelResponse } from "@vercel/node";

const server = createServer(app);

// Vercel will call this handler
export default function handler(req: VercelRequest, res: VercelResponse) {
  server.emit("request", req, res);
}
