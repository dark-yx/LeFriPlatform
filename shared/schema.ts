import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Mongoose Schemas
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  googleId: { type: String },
  language: { type: String, default: "en" },
  country: { type: String, default: "EC" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const emergencyContactSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  relationship: { type: String, required: true },
  whatsappEnabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const legalProcessSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "pending" },
  progress: { type: Number, default: 0 },
  currentStep: { type: Number, default: 0 },
  totalSteps: { type: Number, default: 5 },
  steps: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: String },
    documents: [{ type: String }],
    requirements: [{ type: String }]
  }],
  requiredDocuments: [{ type: String }],
  legalBasis: { type: String, default: "" },
  constitutionalArticles: [{ type: String }],
  timeline: { type: String, default: "" },
  metadata: { 
    type: Schema.Types.Mixed,
    default: {
      priority: 'medium',
      caseNumber: '',
      court: '',
      judge: '',
      opposingParty: '',
      amount: '',
      deadline: ''
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const consultationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  response: { type: String, required: true },
  country: { type: String, default: "EC" },
  language: { type: String, default: "es" },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

const emergencyAlertSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  latitude: { type: String },
  longitude: { type: String },
  address: { type: String },
  contactsNotified: { type: Schema.Types.Mixed },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// For RAG and vector search
const legalDocumentSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  country: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  embedding: [{ type: Number }], // Vector embeddings for similarity search
  constitutionId: { type: String },
  sectionId: { type: String },
  sectionName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Conversation history for context-aware responses
const conversationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  context: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Mongoose Models
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const EmergencyContact = mongoose.models.EmergencyContact || mongoose.model('EmergencyContact', emergencyContactSchema);
export const LegalProcess = mongoose.models.LegalProcess || mongoose.model('LegalProcess', legalProcessSchema);
export const Consultation = mongoose.models.Consultation || mongoose.model('Consultation', consultationSchema);
export const EmergencyAlert = mongoose.models.EmergencyAlert || mongoose.model('EmergencyAlert', emergencyAlertSchema);
export const LegalDocument = mongoose.models.LegalDocument || mongoose.model('LegalDocument', legalDocumentSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);

// Zod validation schemas
export const insertUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  phone: z.string().optional(),
  googleId: z.string().optional(),
  language: z.string().optional(),
  country: z.string().optional(),
});

export const insertEmergencyContactSchema = z.object({
  userId: z.string(),
  name: z.string().min(1),
  phone: z.string().min(1),
  relationship: z.string().min(1),
  whatsappEnabled: z.boolean().optional(),
});

export const insertLegalProcessSchema = z.object({
  userId: z.string(),
  type: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
  currentStep: z.number().optional(),
  totalSteps: z.number().min(1),
  metadata: z.any().optional(),
});

export const insertConsultationSchema = z.object({
  userId: z.string(),
  query: z.string().min(1),
  response: z.string().min(1),
  country: z.string().optional(),
  language: z.string().optional(),
  metadata: z.any().optional(),
});

export const insertEmergencyAlertSchema = z.object({
  userId: z.string(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  address: z.string().optional(),
  contactsNotified: z.any().optional(),
  status: z.string().min(1),
});

// TypeScript types
export interface UserDocument extends Document {
  email: string;
  name: string;
  phone?: string;
  googleId?: string;
  language: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContactDocument extends Document {
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  whatsappEnabled: boolean;
  createdAt: Date;
}

export interface LegalProcessDocument extends Document {
  userId: string;
  type: string;
  title: string;
  description?: string;
  status: string;
  currentStep: number;
  totalSteps: number;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConsultationDocument extends Document {
  userId: string;
  query: string;
  response: string;
  country: string;
  language: string;
  metadata?: any;
  createdAt: Date;
}

export interface EmergencyAlertDocument extends Document {
  userId: string;
  latitude?: string;
  longitude?: string;
  address?: string;
  contactsNotified?: any;
  status: string;
  createdAt: Date;
}

export interface LegalDocumentDocument extends Document {
  title: string;
  content: string;
  country: string;
  category: string;
  tags: string[];
  embedding: number[];
  constitutionId?: string;
  sectionId?: string;
  sectionName?: string;
  createdAt: Date;
}

export interface ConversationDocument extends Document {
  userId: string;
  sessionId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  context?: any;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type InsertLegalProcess = z.infer<typeof insertLegalProcessSchema>;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type InsertEmergencyAlert = z.infer<typeof insertEmergencyAlertSchema>;