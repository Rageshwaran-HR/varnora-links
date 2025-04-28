var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api/index.ts
import express2 from "express";

// api/routes.ts
import { createServer } from "http";

// shared/schema.ts
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

// api/storage.ts
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
function setupAuth(app2) {
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
  app2.set("trust proxy", 1);
  app2.use(session(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
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
  app2.post("/api/register", async (req, res, next) => {
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
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

// api/storage.ts
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
  sessionStore;
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
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.get("/api/links", async (req, res) => {
    try {
      const links2 = await storage.getLinks();
      res.json(links2);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve links" });
    }
  });
  app2.get("/api/links/:id", async (req, res) => {
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
  app2.post("/api/links", async (req, res) => {
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
  app2.put("/api/links/:id", async (req, res) => {
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
  app2.delete("/api/links/:id", async (req, res) => {
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
  app2.get("/api/company-info", async (req, res) => {
    try {
      const info = await storage.getCompanyInfo();
      res.json(info);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve company info" });
    }
  });
  app2.put("/api/company-info", async (req, res) => {
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
  app2.get("/api/appearance", async (req, res) => {
    try {
      const settings = await storage.getAppearance();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve appearance settings" });
    }
  });
  app2.put("/api/appearance", async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// api/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
if (!__dirname) {
  throw new Error("Failed to resolve __dirname");
}
var staticPath = path.resolve(__dirname, "some-directory");
if (!staticPath) {
  throw new Error("Static path is undefined");
}
console.log("Resolved path:", path.resolve(__dirname, "client", "src"));
var vite_config_default = defineConfig(async () => {
  const plugins = [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      // Dynamically import this only when needed
      (await import("@replit/vite-plugin-cartographer")).cartographer()
    ] : []
  ];
  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets")
      }
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist"),
      // Change outDir to 'dist' instead of 'dist/public'
      emptyOutDir: true
    }
  };
});

// api/vite.ts
import { nanoid } from "nanoid";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var viteLogger = createLogger();
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// api/index.ts
import path3 from "path";
import "dotenv/config";
import { fileURLToPath as fileURLToPath3 } from "url";
var __filename3 = fileURLToPath3(import.meta.url);
var __dirname3 = path3.dirname(__filename3);
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      console.log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    const staticPath2 = path3.join(__dirname3, "public");
    console.log("Serving static from", staticPath2);
    app.use(express2.static(staticPath2));
    app.get("*", (req, res) => {
      res.sendFile(path3.join(staticPath2, "index.html"));
    });
  }
  const port = process.env.PORT || 5e3;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
