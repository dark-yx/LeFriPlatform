import { pgTable, text, serial, integer, boolean, timestamp, json, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  googleId: text("google_id").unique(),
  language: text("language").notNull().default("es"), // es, en, fr
  country: text("country").notNull().default("EC"), // ISO country codes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  relationship: text("relationship").notNull(),
  whatsappEnabled: boolean("whatsapp_enabled").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const legalDocs = pgTable("legal_docs", {
  id: serial("id").primaryKey(),
  country: text("country").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  sourceUrl: text("source_url"),
  type: text("type").notNull(), // constitution, law, regulation, treaty, other
  lastSynced: timestamp("last_synced"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const legalProcesses = pgTable("legal_processes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  processType: text("process_type").notNull(), // divorcio, contrato, laboral
  currentStep: integer("current_step").notNull().default(0),
  status: text("status").notNull().default("in_progress"), // in_progress, completed, canceled, pending_review
  data: json("data").notNull().default({}),
  startDate: timestamp("start_date").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  finalDocumentUrl: text("final_document_url"),
});

export const consultations = pgTable("consultations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  query: text("query").notNull(),
  response: text("response").notNull(),
  country: text("country").notNull(),
  language: text("language").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emergencyAlerts = pgTable("emergency_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  address: text("address"),
  contactsNotified: json("contacts_notified").notNull().default([]),
  status: text("status").notNull().default("sent"), // sent, failed, partial
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
  createdAt: true,
});

export const insertLegalProcessSchema = createInsertSchema(legalProcesses).omit({
  id: true,
  startDate: true,
  lastUpdated: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  createdAt: true,
});

export const insertEmergencyAlertSchema = createInsertSchema(emergencyAlerts).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type LegalProcess = typeof legalProcesses.$inferSelect;
export type InsertLegalProcess = z.infer<typeof insertLegalProcessSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type EmergencyAlert = typeof emergencyAlerts.$inferSelect;
export type InsertEmergencyAlert = z.infer<typeof insertEmergencyAlertSchema>;
