import { 
  users, emergencyContacts, legalProcesses, consultations, emergencyAlerts,
  type User, type InsertUser, type EmergencyContact, type InsertEmergencyContact,
  type LegalProcess, type InsertLegalProcess, type Consultation, type InsertConsultation,
  type EmergencyAlert, type InsertEmergencyAlert
} from "@shared/schema";

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
      ...insertUser,
      id,
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
      ...insertContact,
      id,
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
      ...insertProcess,
      id,
      startDate: now,
      lastUpdated: now,
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
      ...insertAlert,
      id,
      createdAt: new Date(),
    };
    this.emergencyAlerts.set(id, alert);
    return alert;
  }
}

export const storage = new MemStorage();
