var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api/index.ts
import express2 from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

// api/routes.ts
import { createServer } from "http";

// api/schema.ts
var schema_exports = {};
__export(schema_exports, {
  appearance: () => appearance,
  companyInfo: () => companyInfo,
  insertCompanyInfoSchema: () => insertCompanyInfoSchema,
  insertLinkSchema: () => insertLinkSchema,
  insertUserSchema: () => insertUserSchema,
  links: () => links,
  users: () => users
});
import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var links = pgTable("links", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  iconBgColor: text("icon_bg_color").notNull(),
  order: integer("order").notNull(),
  active: boolean("active").notNull().default(true)
});
var insertLinkSchema = createInsertSchema(links).pick({
  title: true,
  url: true,
  description: true,
  icon: true,
  iconBgColor: true,
  order: true,
  active: true
});
var companyInfo = pgTable("company_info", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slogan: text("slogan").notNull(),
  about: text("about").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  website: text("website").notNull()
});
var insertCompanyInfoSchema = createInsertSchema(companyInfo).pick({
  name: true,
  slogan: true,
  about: true,
  email: true,
  phone: true,
  address: true,
  website: true
});
var appearance = pgTable("appearance", {
  id: serial("id").primaryKey(),
  primaryColor: text("primary_color").notNull().default("#D4AF37"),
  secondaryColor: text("secondary_color").notNull().default("#B8860B"),
  backgroundColor: text("background_color").notNull().default("#000000"),
  textColor: text("text_color").notNull().default("#FFFFFF"),
  fontFamily: text("font_family").notNull().default("Cinzel"),
  animationEnabled: boolean("animation_enabled").notNull().default(true),
  particlesEnabled: boolean("particles_enabled").notNull().default(true)
});

// lib/storage.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm";
import session2 from "express-session";
import connectPg from "connect-pg-simple";
import ws from "ws";

// api/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app3) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "varnora-session-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1e3 * 60 * 60 * 24,
      // 1 day
      secure: process.env.NODE_ENV === "production"
    }
  };
  app3.set("trust proxy", 1);
  app3.use(session(sessionSettings));
  app3.use(passport.initialize());
  app3.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !await comparePasswords(password, user.password)) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });
  app3.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }
    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password)
    });
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });
  app3.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app3.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app3.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// lib/storage.ts
import "dotenv/config";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool, { schema: schema_exports });
var PostgresSessionStore = connectPg(session2);
var DatabaseStorage = class {
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
    this.initializeAdminUser();
    this.initializeLinks();
    this.initializeCompanyInfo();
    this.initializeAppearance();
  }
  async initializeAdminUser() {
    const existingAdmin = await this.getUserByUsername("admin");
    if (!existingAdmin) {
      await this.createUser({
        username: "admin",
        password: await hashPassword("varnora2025")
      });
    }
  }
  async initializeLinks() {
    const existingLinks = await this.getLinks();
    if (existingLinks.length === 0) {
      await this.createLink({
        title: "Instagram",
        url: "https://instagram.com/varnora",
        description: "Follow us on Instagram",
        icon: "FaInstagram",
        iconBgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
        order: 1,
        active: true
      });
      await this.createLink({
        title: "Website",
        url: "https://varnora.com",
        description: "Visit our Website",
        icon: "FaGlobe",
        iconBgColor: "bg-gradient-to-r from-blue-500 to-teal-400",
        order: 2,
        active: true
      });
      await this.createLink({
        title: "WhatsApp",
        url: "https://wa.me/911234567890",
        description: "Contact us on WhatsApp",
        icon: "FaWhatsapp",
        iconBgColor: "bg-gradient-to-r from-green-500 to-emerald-400",
        order: 3,
        active: true
      });
    }
  }
  async initializeCompanyInfo() {
    const existingInfo = await this.getCompanyInfo();
    if (!existingInfo) {
      await this.updateCompanyInfo({
        name: "Varnora",
        slogan: "Premium Luxury Solutions",
        about: "Varnora is a premium luxury brand offering high-quality products and services. We strive for excellence in everything we do.",
        email: "info@varnora.com",
        phone: "+91 123 456 7890",
        address: "123 Luxury Avenue, Premium District, Delhi, India",
        website: "https://varnora.com"
      });
    }
  }
  async initializeAppearance() {
    const existingAppearance = await this.getAppearance();
    if (!existingAppearance) {
      await this.updateAppearance({
        primaryColor: "#D4AF37",
        secondaryColor: "#B8860B",
        backgroundColor: "#000000",
        textColor: "#FFFFFF",
        fontFamily: "Cinzel",
        animationEnabled: true,
        particlesEnabled: true
      });
    }
  }
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Link methods
  async getLinks() {
    const allLinks = await db.select().from(links);
    return allLinks.sort((a, b) => a.order - b.order);
  }
  async getLink(id) {
    const [link] = await db.select().from(links).where(eq(links.id, id));
    return link || void 0;
  }
  async createLink(link) {
    const [newLink] = await db.insert(links).values(link).returning();
    return newLink;
  }
  async updateLink(id, linkUpdate) {
    const [updatedLink] = await db.update(links).set(linkUpdate).where(eq(links.id, id)).returning();
    return updatedLink || void 0;
  }
  async deleteLink(id) {
    const [deletedLink] = await db.delete(links).where(eq(links.id, id)).returning();
    return !!deletedLink;
  }
  // Company Info methods
  async getCompanyInfo() {
    const [info] = await db.select().from(companyInfo);
    return info || void 0;
  }
  async updateCompanyInfo(info) {
    const existing = await this.getCompanyInfo();
    if (existing) {
      const [updatedInfo] = await db.update(companyInfo).set(info).where(eq(companyInfo.id, existing.id)).returning();
      return updatedInfo;
    } else {
      const [newInfo] = await db.insert(companyInfo).values(info).returning();
      return newInfo;
    }
  }
  // Appearance methods
  async getAppearance() {
    const [settings] = await db.select().from(appearance);
    return settings || void 0;
  }
  async updateAppearance(settings) {
    const existing = await this.getAppearance();
    if (existing) {
      const [updatedSettings] = await db.update(appearance).set(settings).where(eq(appearance.id, existing.id)).returning();
      return updatedSettings;
    } else {
      const [newSettings] = await db.insert(appearance).values(settings).returning();
      return newSettings;
    }
  }
};
var storage = new DatabaseStorage();

// api/routes.ts
import { ZodError } from "zod";
async function registerRoutes(app3) {
  setupAuth(app3);
  app3.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app3.get("/api/links", async (req, res) => {
    try {
      const links2 = await storage.getLinks();
      res.json(links2);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve links" });
    }
  });
  app3.get("/api/links/:id", async (req, res) => {
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
  app3.post("/api/links", async (req, res) => {
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
  app3.put("/api/links/:id", async (req, res) => {
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
  app3.delete("/api/links/:id", async (req, res) => {
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
  app3.get("/api/companys", async (req, res) => {
    try {
      const info = await storage.getCompanyInfo();
      res.json(info);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve company info" });
    }
  });
  app3.put("/api/companys", async (req, res) => {
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
  app3.get("/api/appearance", async (req, res) => {
    try {
      const settings = await storage.getAppearance();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve appearance settings" });
    }
  });
  app3.put("/api/appearance", async (req, res) => {
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
  const httpServer = createServer(app3);
  return httpServer;
}

// api/index.ts
import serverless from "serverless-http";

// api/company-info.ts
import { Router } from "express";
var router = Router();
router.get("/", async (req, res) => {
  try {
    const info = await storage.getCompanyInfo();
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve company info" });
  }
});
router.put("/", async (req, res) => {
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
var company_info_default = router;

// api/links.ts
import express from "express";
import { ZodError as ZodError2 } from "zod";
var app = express();
var router2 = express.Router();
router2.get("/", async (req, res) => {
  try {
    const links2 = await storage.getLinks();
    res.json(links2);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve links" });
  }
});
router2.get("/:id", async (req, res) => {
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
router2.post("/", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const linkData = insertLinkSchema.parse(req.body);
    const link = await storage.createLink(linkData);
    res.status(201).json(link);
  } catch (error) {
    if (error instanceof ZodError2) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: "Failed to create link" });
  }
});
router2.put("/:id", async (req, res) => {
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
router2.delete("/:id", async (req, res) => {
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
app.use("/api/links", router2);
var links_default = app;

// api/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
console.log(path.resolve("./api/routes"));
var app2 = express2();
app2.use(cors());
app2.use(express2.json());
app2.use(express2.urlencoded({ extended: false }));
app2.use("/api/links", links_default);
app2.use("/api/companys", company_info_default);
await registerRoutes(app2);
app2.use(express2.static(path.join(__dirname, "..", "client", "dist")));
var handler = serverless(app2);
if (process.env.NODE_ENV === "development") {
  const PORT = 5e3;
  app2.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
export {
  handler
};
