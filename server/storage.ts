import { 
  users, emergencyContacts, legalProcesses, consultations, emergencyAlerts,
  type User, type InsertUser, type EmergencyContact, type InsertEmergencyContact,
  type LegalProcess, type InsertLegalProcess, type Consultation, type InsertConsultation,
  type EmergencyAlert, type InsertEmergencyAlert
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Emergency contacts
  getEmergencyContacts(userId: number): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  updateEmergencyContact(id: number, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContact>;
  deleteEmergencyContact(id: number): Promise<void>;

  // Legal processes
  getLegalProcesses(userId: number): Promise<LegalProcess[]>;
  getLegalProcess(id: number): Promise<LegalProcess | undefined>;
  createLegalProcess(process: InsertLegalProcess): Promise<LegalProcess>;
  updateLegalProcess(id: number, updates: Partial<InsertLegalProcess>): Promise<LegalProcess>;

  // Consultations
  getConsultations(userId: number): Promise<Consultation[]>;
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;

  // Emergency alerts
  getEmergencyAlerts(userId: number): Promise<EmergencyAlert[]>;
  createEmergencyAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlert>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private emergencyContacts: Map<number, EmergencyContact>;
  private legalProcesses: Map<number, LegalProcess>;
  private consultations: Map<number, Consultation>;
  private emergencyAlerts: Map<number, EmergencyAlert>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.emergencyContacts = new Map();
    this.legalProcesses = new Map();
    this.consultations = new Map();
    this.emergencyAlerts = new Map();
    this.currentId = 1;

    // Initialize with demo user
    this.createUser({
      email: "jonnathan.pena@example.com",
      name: "Jonnathan Peña",
      googleId: "demo_google_id",
      language: "es",
      country: "EC"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.googleId === googleId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const now = new Date();
    const user: User = {
      id,
      name: insertUser.name,
      email: insertUser.email,
      googleId: insertUser.googleId || null,
      language: insertUser.language || "es",
      country: insertUser.country || "EC",
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Emergency contacts
  async getEmergencyContacts(userId: number): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).filter(contact => contact.userId === userId);
  }

  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = this.currentId++;
    const contact: EmergencyContact = {
      id,
      userId: insertContact.userId,
      name: insertContact.name,
      phone: insertContact.phone,
      relationship: insertContact.relationship,
      whatsappEnabled: insertContact.whatsappEnabled || true,
      createdAt: new Date(),
    };
    this.emergencyContacts.set(id, contact);
    return contact;
  }

  async updateEmergencyContact(id: number, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContact> {
    const contact = this.emergencyContacts.get(id);
    if (!contact) throw new Error("Emergency contact not found");
    
    const updatedContact = { ...contact, ...updates };
    this.emergencyContacts.set(id, updatedContact);
    return updatedContact;
  }

  async deleteEmergencyContact(id: number): Promise<void> {
    this.emergencyContacts.delete(id);
  }

  // Legal processes
  async getLegalProcesses(userId: number): Promise<LegalProcess[]> {
    return Array.from(this.legalProcesses.values()).filter(process => process.userId === userId);
  }

  async getLegalProcess(id: number): Promise<LegalProcess | undefined> {
    return this.legalProcesses.get(id);
  }

  async createLegalProcess(insertProcess: InsertLegalProcess): Promise<LegalProcess> {
    const id = this.currentId++;
    const now = new Date();
    const process: LegalProcess = {
      id,
      userId: insertProcess.userId,
      processType: insertProcess.processType,
      currentStep: insertProcess.currentStep || 0,
      status: insertProcess.status || "in_progress",
      data: insertProcess.data || {},
      startDate: now,
      lastUpdated: now,
      finalDocumentUrl: insertProcess.finalDocumentUrl || null,
    };
    this.legalProcesses.set(id, process);
    return process;
  }

  async updateLegalProcess(id: number, updates: Partial<InsertLegalProcess>): Promise<LegalProcess> {
    const process = this.legalProcesses.get(id);
    if (!process) throw new Error("Legal process not found");
    
    const updatedProcess = { ...process, ...updates, lastUpdated: new Date() };
    this.legalProcesses.set(id, updatedProcess);
    return updatedProcess;
  }

  // Consultations
  async getConsultations(userId: number): Promise<Consultation[]> {
    return Array.from(this.consultations.values()).filter(consultation => consultation.userId === userId);
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const id = this.currentId++;
    const consultation: Consultation = {
      ...insertConsultation,
      id,
      createdAt: new Date(),
    };
    this.consultations.set(id, consultation);
    return consultation;
  }

  // Emergency alerts
  async getEmergencyAlerts(userId: number): Promise<EmergencyAlert[]> {
    return Array.from(this.emergencyAlerts.values()).filter(alert => alert.userId === userId);
  }

  async createEmergencyAlert(insertAlert: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const id = this.currentId++;
    const alert: EmergencyAlert = {
      id,
      userId: insertAlert.userId,
      latitude: insertAlert.latitude || null,
      longitude: insertAlert.longitude || null,
      address: insertAlert.address || null,
      contactsNotified: insertAlert.contactsNotified || [],
      status: insertAlert.status || "sent",
      createdAt: new Date(),
    };
    this.emergencyAlerts.set(id, alert);
    return alert;
  }
}

// DatabaseStorage implementation using PostgreSQL
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getEmergencyContacts(userId: number): Promise<EmergencyContact[]> {
    return await db
      .select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.userId, userId));
  }

  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const [contact] = await db
      .insert(emergencyContacts)
      .values(insertContact)
      .returning();
    return contact;
  }

  async updateEmergencyContact(id: number, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContact> {
    const [contact] = await db
      .update(emergencyContacts)
      .set(updates)
      .where(eq(emergencyContacts.id, id))
      .returning();
    return contact;
  }

  async deleteEmergencyContact(id: number): Promise<void> {
    await db.delete(emergencyContacts).where(eq(emergencyContacts.id, id));
  }

  async getLegalProcesses(userId: number): Promise<LegalProcess[]> {
    return await db
      .select()
      .from(legalProcesses)
      .where(eq(legalProcesses.userId, userId));
  }

  async getLegalProcess(id: number): Promise<LegalProcess | undefined> {
    const [process] = await db
      .select()
      .from(legalProcesses)
      .where(eq(legalProcesses.id, id));
    return process || undefined;
  }

  async createLegalProcess(insertProcess: InsertLegalProcess): Promise<LegalProcess> {
    const [process] = await db
      .insert(legalProcesses)
      .values(insertProcess)
      .returning();
    return process;
  }

  async updateLegalProcess(id: number, updates: Partial<InsertLegalProcess>): Promise<LegalProcess> {
    const [process] = await db
      .update(legalProcesses)
      .set(updates)
      .where(eq(legalProcesses.id, id))
      .returning();
    return process;
  }

  async getConsultations(userId: number): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .where(eq(consultations.userId, userId));
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<Consultation> {
    const [consultation] = await db
      .insert(consultations)
      .values(insertConsultation)
      .returning();
    return consultation;
  }

  async getEmergencyAlerts(userId: number): Promise<EmergencyAlert[]> {
    return await db
      .select()
      .from(emergencyAlerts)
      .where(eq(emergencyAlerts.userId, userId));
  }

  async createEmergencyAlert(insertAlert: InsertEmergencyAlert): Promise<EmergencyAlert> {
    const [alert] = await db
      .insert(emergencyAlerts)
      .values(insertAlert)
      .returning();
    return alert;
  }
}

export const storage = new DatabaseStorage();
