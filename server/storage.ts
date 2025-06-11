import { 
  User, EmergencyContact, LegalProcess, Consultation, EmergencyAlert,
  type UserDocument, type EmergencyContactDocument, type LegalProcessDocument, 
  type ConsultationDocument, type EmergencyAlertDocument,
  type InsertUser, type InsertEmergencyContact, type InsertLegalProcess, 
  type InsertConsultation, type InsertEmergencyAlert
} from "@shared/schema";
import { connectToDatabase } from "./db";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<UserDocument | undefined>;
  getUserByEmail(email: string): Promise<UserDocument | undefined>;
  getUserByGoogleId(googleId: string): Promise<UserDocument | undefined>;
  createUser(user: InsertUser): Promise<UserDocument>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<UserDocument>;

  // Emergency contacts
  getEmergencyContacts(userId: string): Promise<EmergencyContactDocument[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContactDocument>;
  updateEmergencyContact(id: string, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContactDocument>;
  deleteEmergencyContact(id: string): Promise<void>;

  // Legal processes
  getLegalProcesses(userId: string): Promise<LegalProcessDocument[]>;
  getLegalProcess(id: string): Promise<LegalProcessDocument | undefined>;
  createLegalProcess(process: InsertLegalProcess): Promise<LegalProcessDocument>;
  updateLegalProcess(id: string, updates: Partial<InsertLegalProcess>): Promise<LegalProcessDocument>;

  // Consultations
  getConsultations(userId: string): Promise<ConsultationDocument[]>;
  createConsultation(consultation: InsertConsultation): Promise<ConsultationDocument>;

  // Emergency alerts
  getEmergencyAlerts(userId: string): Promise<EmergencyAlertDocument[]>;
  createEmergencyAlert(alert: InsertEmergencyAlert): Promise<EmergencyAlertDocument>;
}

// In-memory storage for development fallback
export class MemoryStorage implements IStorage {
  private users: Map<string, UserDocument> = new Map();
  private emergencyContacts: Map<string, EmergencyContactDocument> = new Map();
  private legalProcesses: Map<string, LegalProcessDocument> = new Map();
  private consultations: Map<string, ConsultationDocument> = new Map();
  private emergencyAlerts: Map<string, EmergencyAlertDocument> = new Map();

  constructor() {
    // Create demo user
    const demoUserId = '66a1b2c3d4e5f6789abc1234';
    const demoUser = {
      _id: demoUserId,
      email: "demo@lefri.ai",
      name: "Usuario Demo",
      googleId: "demo_google_id",
      language: "es",
      country: "EC",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserDocument;
    this.users.set(demoUserId, demoUser);
  }

  async getUser(id: string): Promise<UserDocument | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<UserDocument | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByGoogleId(googleId: string): Promise<UserDocument | undefined> {
    return Array.from(this.users.values()).find(user => user.googleId === googleId);
  }

  async createUser(insertUser: InsertUser): Promise<UserDocument> {
    const id = Date.now().toString();
    const user = {
      _id: id,
      ...insertUser,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as UserDocument;
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<UserDocument> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getEmergencyContacts(userId: string): Promise<EmergencyContactDocument[]> {
    return Array.from(this.emergencyContacts.values()).filter(contact => contact.userId === userId);
  }

  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContactDocument> {
    const id = Date.now().toString();
    const contact = {
      _id: id,
      ...insertContact,
      createdAt: new Date(),
    } as EmergencyContactDocument;
    this.emergencyContacts.set(id, contact);
    return contact;
  }

  async updateEmergencyContact(id: string, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContactDocument> {
    const contact = this.emergencyContacts.get(id);
    if (!contact) throw new Error('Emergency contact not found');
    
    const updatedContact = { ...contact, ...updates };
    this.emergencyContacts.set(id, updatedContact);
    return updatedContact;
  }

  async deleteEmergencyContact(id: string): Promise<void> {
    this.emergencyContacts.delete(id);
  }

  async getLegalProcesses(userId: string): Promise<LegalProcessDocument[]> {
    return Array.from(this.legalProcesses.values()).filter(process => process.userId === userId);
  }

  async getLegalProcess(id: string): Promise<LegalProcessDocument | undefined> {
    return this.legalProcesses.get(id);
  }

  async createLegalProcess(insertProcess: InsertLegalProcess): Promise<LegalProcessDocument> {
    const id = Date.now().toString();
    const process = {
      _id: id,
      ...insertProcess,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as LegalProcessDocument;
    this.legalProcesses.set(id, process);
    return process;
  }

  async updateLegalProcess(id: string, updates: Partial<InsertLegalProcess>): Promise<LegalProcessDocument> {
    const process = this.legalProcesses.get(id);
    if (!process) throw new Error('Legal process not found');
    
    const updatedProcess = { ...process, ...updates, updatedAt: new Date() };
    this.legalProcesses.set(id, updatedProcess);
    return updatedProcess;
  }

  async getConsultations(userId: string): Promise<ConsultationDocument[]> {
    return Array.from(this.consultations.values())
      .filter(consultation => consultation.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<ConsultationDocument> {
    const id = Date.now().toString();
    const consultation = {
      _id: id,
      ...insertConsultation,
      createdAt: new Date(),
    } as ConsultationDocument;
    this.consultations.set(id, consultation);
    return consultation;
  }

  async getEmergencyAlerts(userId: string): Promise<EmergencyAlertDocument[]> {
    return Array.from(this.emergencyAlerts.values())
      .filter(alert => alert.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createEmergencyAlert(insertAlert: InsertEmergencyAlert): Promise<EmergencyAlertDocument> {
    const id = Date.now().toString();
    const alert = {
      _id: id,
      ...insertAlert,
      createdAt: new Date(),
    } as EmergencyAlertDocument;
    this.emergencyAlerts.set(id, alert);
    return alert;
  }
}

// MongoDB Storage implementation
export class MongoStorage implements IStorage {
  private fallback: MemoryStorage;

  constructor() {
    this.fallback = new MemoryStorage();
    connectToDatabase().catch(() => {
      console.log('Using memory storage fallback');
    });
  }

  async getUser(id: string): Promise<UserDocument | undefined> {
    try {
      await connectToDatabase();
      const user = await User.findById(id);
      return user || undefined;
    } catch {
      return this.fallback.getUser(id);
    }
  }

  async getUserByEmail(email: string): Promise<UserDocument | undefined> {
    try {
      await connectToDatabase();
      const user = await User.findOne({ email });
      return user || undefined;
    } catch {
      return this.fallback.getUserByEmail(email);
    }
  }

  async getUserByGoogleId(googleId: string): Promise<UserDocument | undefined> {
    try {
      await connectToDatabase();
      const user = await User.findOne({ googleId });
      return user || undefined;
    } catch {
      return this.fallback.getUserByGoogleId(googleId);
    }
  }

  async createUser(insertUser: InsertUser): Promise<UserDocument> {
    try {
      await connectToDatabase();
      const user = new User(insertUser);
      return await user.save();
    } catch {
      return this.fallback.createUser(insertUser);
    }
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<UserDocument> {
    try {
      await connectToDatabase();
      const user = await User.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
      if (!user) throw new Error('User not found');
      return user;
    } catch {
      return this.fallback.updateUser(id, updates);
    }
  }

  async getEmergencyContacts(userId: string): Promise<EmergencyContactDocument[]> {
    try {
      await connectToDatabase();
      return await EmergencyContact.find({ userId });
    } catch {
      return this.fallback.getEmergencyContacts(userId);
    }
  }

  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContactDocument> {
    try {
      await connectToDatabase();
      const contact = new EmergencyContact(insertContact);
      return await contact.save();
    } catch {
      return this.fallback.createEmergencyContact(insertContact);
    }
  }

  async updateEmergencyContact(id: string, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContactDocument> {
    try {
      await connectToDatabase();
      const contact = await EmergencyContact.findByIdAndUpdate(id, updates, { new: true });
      if (!contact) throw new Error('Emergency contact not found');
      return contact;
    } catch {
      return this.fallback.updateEmergencyContact(id, updates);
    }
  }

  async deleteEmergencyContact(id: string): Promise<void> {
    try {
      await connectToDatabase();
      await EmergencyContact.findByIdAndDelete(id);
    } catch {
      return this.fallback.deleteEmergencyContact(id);
    }
  }

  async getLegalProcesses(userId: string): Promise<LegalProcessDocument[]> {
    try {
      await connectToDatabase();
      return await LegalProcess.find({ userId });
    } catch {
      return this.fallback.getLegalProcesses(userId);
    }
  }

  async getLegalProcess(id: string): Promise<LegalProcessDocument | undefined> {
    try {
      await connectToDatabase();
      const process = await LegalProcess.findById(id);
      return process || undefined;
    } catch {
      return this.fallback.getLegalProcess(id);
    }
  }

  async createLegalProcess(insertProcess: InsertLegalProcess): Promise<LegalProcessDocument> {
    try {
      await connectToDatabase();
      const process = new LegalProcess(insertProcess);
      return await process.save();
    } catch {
      return this.fallback.createLegalProcess(insertProcess);
    }
  }

  async updateLegalProcess(id: string, updates: Partial<InsertLegalProcess>): Promise<LegalProcessDocument> {
    try {
      await connectToDatabase();
      const process = await LegalProcess.findByIdAndUpdate(
        id, 
        { ...updates, updatedAt: new Date() }, 
        { new: true }
      );
      if (!process) throw new Error('Legal process not found');
      return process;
    } catch {
      return this.fallback.updateLegalProcess(id, updates);
    }
  }

  async getConsultations(userId: string): Promise<ConsultationDocument[]> {
    try {
      await connectToDatabase();
      return await Consultation.find({ userId }).sort({ createdAt: -1 });
    } catch {
      return this.fallback.getConsultations(userId);
    }
  }

  async createConsultation(insertConsultation: InsertConsultation): Promise<ConsultationDocument> {
    try {
      await connectToDatabase();
      const consultation = new Consultation(insertConsultation);
      return await consultation.save();
    } catch {
      return this.fallback.createConsultation(insertConsultation);
    }
  }

  async getEmergencyAlerts(userId: string): Promise<EmergencyAlertDocument[]> {
    try {
      await connectToDatabase();
      return await EmergencyAlert.find({ userId }).sort({ createdAt: -1 });
    } catch {
      return this.fallback.getEmergencyAlerts(userId);
    }
  }

  async createEmergencyAlert(insertAlert: InsertEmergencyAlert): Promise<EmergencyAlertDocument> {
    try {
      await connectToDatabase();
      const alert = new EmergencyAlert(insertAlert);
      return await alert.save();
    } catch {
      return this.fallback.createEmergencyAlert(insertAlert);
    }
  }
}

export const storage = new MongoStorage();