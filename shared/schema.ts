import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  rarity: text("rarity"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userCards = pgTable("user_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cardId: integer("card_id").notNull(),
  condition: text("condition"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").notNull(),
  status: text("status").default("open").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tradeCards = pgTable("trade_cards", {
  id: serial("id").primaryKey(),
  tradeId: integer("trade_id").notNull(),
  cardId: integer("card_id").notNull(),
  type: text("type").notNull(), // "OFFERING" or "RECEIVING"
});

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Card schemas
export const addCardSchema = z.object({
  cardId: z.number().min(1, "Card ID is required"),
  condition: z.string().optional(),
});

// Trade schemas
export const createTradeSchema = z.object({
  offeringCards: z.array(z.number()).min(1, "At least one offering card is required"),
  receivingCards: z.array(z.number()).min(1, "At least one receiving card is required"),
  description: z.string().optional(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Card = typeof cards.$inferSelect;
export type UserCard = typeof userCards.$inferSelect;
export type Trade = typeof trades.$inferSelect;
export type TradeCard = typeof tradeCards.$inferSelect;

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type AddCardData = z.infer<typeof addCardSchema>;
export type CreateTradeData = z.infer<typeof createTradeSchema>;

// API Response types
export interface AuthResponse {
  user: User;
  token: string;
}

export interface TradeWithCards extends Trade {
  creator: User;
  offeringCards: Card[];
  receivingCards: Card[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    rpp: number;
    total: number;
    totalPages: number;
  };
}
