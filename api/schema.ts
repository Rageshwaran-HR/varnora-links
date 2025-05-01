import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Social links and other links the user can add
export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  iconBgColor: text("icon_bg_color").notNull(),
  order: integer("order").notNull(),
  active: boolean("active").notNull().default(true),
});

export const insertLinkSchema = createInsertSchema(links).pick({
  title: true,
  url: true,
  description: true,
  icon: true,
  iconBgColor: true,
  order: true,
  active: true,
});

export type InsertLink = z.infer<typeof insertLinkSchema>;
export type Link = typeof links.$inferSelect;

// Company Information
export const companyInfo = pgTable("company_info", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slogan: text("slogan").notNull(),
  about: text("about").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  website: text("website").notNull(),
});

export const insertCompanyInfoSchema = createInsertSchema(companyInfo).pick({
  name: true,
  slogan: true,
  about: true,
  email: true,
  phone: true,
  address: true,
  website: true,
});

export type InsertCompanyInfo = z.infer<typeof insertCompanyInfoSchema>;
export type CompanyInfo = typeof companyInfo.$inferSelect;

// Appearance Settings
export const appearance = pgTable("appearance", {
  id: serial("id").primaryKey(),
  primaryColor: text("primary_color").notNull().default("#D4AF37"),
  secondaryColor: text("secondary_color").notNull().default("#B8860B"),
  backgroundColor: text("background_color").notNull().default("#000000"),
  textColor: text("text_color").notNull().default("#FFFFFF"),
  fontFamily: text("font_family").notNull().default("Cinzel"),
  animationEnabled: boolean("animation_enabled").notNull().default(true),
  particlesEnabled: boolean("particles_enabled").notNull().default(true),
});
