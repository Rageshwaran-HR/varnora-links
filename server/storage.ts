import { 
  users, links, companyInfo, appearance,
  type User, type InsertUser, 
  type Link, type InsertLink,
  type CompanyInfo, type InsertCompanyInfo
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private links: Map<number, Link>;
  private companyInfoData: CompanyInfo | undefined;
  private appearanceSettings: any | undefined;
  
  private userCurrentId: number;
  private linkCurrentId: number;
  
  constructor() {
    // Initialize maps and ids
    this.users = new Map();
    this.links = new Map();
    this.userCurrentId = 1;
    this.linkCurrentId = 1;
    
    // Seed admin user
    this.createUser({
      username: "admin",
      password: "5a4d6f9a2f8ed5b8ae5f30c095d92b42.4a7fb24b5e9cc5184ec46f7686a365a9d09c63dffa0f92280b4cd7a4f63ebe2dfdb73cc2a5af8b9ff8b9a50c5a262c77cc8a6028e9cf0f51b7e87b83147cf2a5",
    });
    
    // Seed with default links
    this.createLink({
      title: "Instagram",
      url: "https://instagram.com/varnora",
      description: "Follow us on Instagram",
      icon: "FaInstagram", 
      iconBgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      order: 1,
      active: true
    });
    
    this.createLink({
      title: "Website",
      url: "https://varnora.com",
      description: "Visit our Website",
      icon: "FaGlobe",
      iconBgColor: "bg-gradient-to-r from-blue-500 to-teal-400",
      order: 2,
      active: true
    });
    
    this.createLink({
      title: "WhatsApp",
      url: "https://wa.me/911234567890",
      description: "Contact us on WhatsApp",
      icon: "FaWhatsapp",
      iconBgColor: "bg-gradient-to-r from-green-500 to-emerald-400",
      order: 3,
      active: true
    });
    
    // Seed with default company info
    this.companyInfoData = {
      id: 1,
      name: "Varnora",
      slogan: "Premium Luxury Solutions",
      about: "Varnora is a premium luxury brand offering high-quality products and services. We strive for excellence in everything we do.",
      email: "info@varnora.com",
      phone: "+91 123 456 7890",
      address: "123 Luxury Avenue, Premium District, Delhi, India",
      website: "https://varnora.com"
    };
    
    // Seed with default appearance settings
    this.appearanceSettings = {
      id: 1,
      primaryColor: "#D4AF37",
      secondaryColor: "#B8860B",
      backgroundColor: "#000000", 
      textColor: "#FFFFFF",
      fontFamily: "Cinzel",
      animationEnabled: true,
      particlesEnabled: true
    };
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Link methods
  async getLinks(): Promise<Link[]> {
    return Array.from(this.links.values())
      .sort((a, b) => a.order - b.order);
  }
  
  async getLink(id: number): Promise<Link | undefined> {
    return this.links.get(id);
  }
  
  async createLink(link: InsertLink): Promise<Link> {
    const id = this.linkCurrentId++;
    const newLink: Link = { ...link, id };
    this.links.set(id, newLink);
    return newLink;
  }
  
  async updateLink(id: number, linkUpdate: Partial<InsertLink>): Promise<Link | undefined> {
    const link = this.links.get(id);
    if (!link) return undefined;
    
    const updatedLink = { ...link, ...linkUpdate };
    this.links.set(id, updatedLink);
    return updatedLink;
  }
  
  async deleteLink(id: number): Promise<boolean> {
    return this.links.delete(id);
  }
  
  // Company Info methods
  async getCompanyInfo(): Promise<CompanyInfo | undefined> {
    return this.companyInfoData;
  }
  
  async updateCompanyInfo(info: InsertCompanyInfo): Promise<CompanyInfo> {
    this.companyInfoData = { ...info, id: 1 };
    return this.companyInfoData;
  }
  
  // Appearance methods
  async getAppearance(): Promise<any | undefined> {
    return this.appearanceSettings;
  }
  
  async updateAppearance(settings: any): Promise<any> {
    this.appearanceSettings = { ...settings, id: 1 };
    return this.appearanceSettings;
  }
}

export const storage = new MemStorage();
