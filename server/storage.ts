import { 
  users, links, companyInfo, appearance,
  type User, type InsertUser, 
  type Link, type InsertLink,
  type CompanyInfo, type InsertCompanyInfo
} from "@shared/schema";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import session from "express-session";
import connectPg from "connect-pg-simple";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

const PostgresSessionStore = connectPg(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Link methods
  getLinks(): Promise<Link[]>;
  getLink(id: number): Promise<Link | undefined>;
  createLink(link: InsertLink): Promise<Link>;
  updateLink(id: number, link: Partial<InsertLink>): Promise<Link | undefined>;
  deleteLink(id: number): Promise<boolean>;
  
  // Company Info methods
  getCompanyInfo(): Promise<CompanyInfo | undefined>;
  updateCompanyInfo(info: InsertCompanyInfo): Promise<CompanyInfo>;
  
  // Appearance methods
  getAppearance(): Promise<any | undefined>;
  updateAppearance(settings: any): Promise<any>;
  
  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true
    });
    
    // Seed initial admin user if not exists
    this.initializeAdminUser();
    
    // Seed initial links if not exist
    this.initializeLinks();
    
    // Seed company info if not exists
    this.initializeCompanyInfo();
    
    // Seed appearance settings if not exists
    this.initializeAppearance();
  }
  
  private async initializeAdminUser() {
    const existingAdmin = await this.getUserByUsername("admin");
    if (!existingAdmin) {
      await this.createUser({
        username: "admin",
        password: "5a4d6f9a2f8ed5b8ae5f30c095d92b42.4a7fb24b5e9cc5184ec46f7686a365a9d09c63dffa0f92280b4cd7a4f63ebe2dfdb73cc2a5af8b9ff8b9a50c5a262c77cc8a6028e9cf0f51b7e87b83147cf2a5", // varnora2025
      });
    }
  }
  
  private async initializeLinks() {
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
  
  private async initializeCompanyInfo() {
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
  
  private async initializeAppearance() {
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
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Link methods
  async getLinks(): Promise<Link[]> {
    const allLinks = await db.select().from(links);
    return allLinks.sort((a, b) => a.order - b.order);
  }
  
  async getLink(id: number): Promise<Link | undefined> {
    const [link] = await db.select().from(links).where(eq(links.id, id));
    return link || undefined;
  }
  
  async createLink(link: InsertLink): Promise<Link> {
    const [newLink] = await db.insert(links).values(link).returning();
    return newLink;
  }
  
  async updateLink(id: number, linkUpdate: Partial<InsertLink>): Promise<Link | undefined> {
    const [updatedLink] = await db
      .update(links)
      .set(linkUpdate)
      .where(eq(links.id, id))
      .returning();
    return updatedLink || undefined;
  }
  
  async deleteLink(id: number): Promise<boolean> {
    const [deletedLink] = await db
      .delete(links)
      .where(eq(links.id, id))
      .returning();
    return !!deletedLink;
  }
  
  // Company Info methods
  async getCompanyInfo(): Promise<CompanyInfo | undefined> {
    const [info] = await db.select().from(companyInfo);
    return info || undefined;
  }
  
  async updateCompanyInfo(info: InsertCompanyInfo): Promise<CompanyInfo> {
    const existing = await this.getCompanyInfo();
    
    if (existing) {
      const [updatedInfo] = await db
        .update(companyInfo)
        .set(info)
        .where(eq(companyInfo.id, existing.id))
        .returning();
      return updatedInfo;
    } else {
      const [newInfo] = await db.insert(companyInfo).values(info).returning();
      return newInfo;
    }
  }
  
  // Appearance methods
  async getAppearance(): Promise<any | undefined> {
    const [settings] = await db.select().from(appearance);
    return settings || undefined;
  }
  
  async updateAppearance(settings: any): Promise<any> {
    const existing = await this.getAppearance();
    
    if (existing) {
      const [updatedSettings] = await db
        .update(appearance)
        .set(settings)
        .where(eq(appearance.id, existing.id))
        .returning();
      return updatedSettings;
    } else {
      const [newSettings] = await db.insert(appearance).values(settings).returning();
      return newSettings;
    }
  }
}

export const storage = new DatabaseStorage();
