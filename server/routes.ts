import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEmergencyContactSchema, insertLegalProcessSchema, insertConsultationSchema, insertEmergencyAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware (simplified for demo)
  const requireAuth = (req: any, res: any, next: any) => {
    const userId = req.headers['x-user-id'] || '1'; // Demo user
    req.userId = parseInt(userId as string);
    next();
  };

  // Authentication endpoints
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { email, name, googleId } = req.body;
      
      let user = await storage.getUserByGoogleId(googleId);
      if (!user) {
        user = await storage.getUserByEmail(email);
        if (!user) {
          user = await storage.createUser({
            email,
            name,
            googleId,
            language: "es",
            country: "EC"
          });
        }
      }
      
      res.json({ user, token: `demo_token_${user.id}` });
    } catch (error) {
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Legal consultation endpoints
  app.post("/api/ask", requireAuth, async (req: any, res) => {
    try {
      const { query, country, language } = req.body;
      
      // Simulate AI response (replace with actual Gemini API call)
      const responses = [
        "Según la legislación de " + country + ", en este caso específico tienes derecho a solicitar una indemnización por los daños ocasionados. Te recomiendo recopilar toda la documentación relevante y consultar con un abogado especialista en el área.",
        "La Constitución establece claramente tus derechos en esta situación. El procedimiento a seguir incluye presentar una denuncia formal ante las autoridades competentes dentro del plazo establecido por la ley.",
        "Para este tipo de proceso legal necesitarás los siguientes documentos: cédula de identidad, certificados pertinentes, y evidencia que respalde tu caso. El proceso puede tomar entre 3 a 6 meses dependiendo de la complejidad.",
        "En tu país, la ley protege específicamente estos derechos. Te sugiero iniciar con una mediación antes de proceder con acciones legales más formales, ya que puede resultar en una resolución más rápida y económica."
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      // Save consultation
      await storage.createConsultation({
        userId: req.userId,
        query,
        response,
        country: country || "EC",
        language: language || "es"
      });
      
      res.json({ 
        response,
        citations: [
          { title: "Constitución Nacional", url: "#", relevance: 95 },
          { title: "Código Civil", url: "#", relevance: 87 }
        ],
        confidence: 0.92
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process consultation" });
    }
  });

  // Emergency endpoints
  app.post("/api/emergency", requireAuth, async (req: any, res) => {
    try {
      const { latitude, longitude, address } = req.body;
      
      // Get user's emergency contacts
      const contacts = await storage.getEmergencyContacts(req.userId);
      
      // Simulate sending WhatsApp alerts
      const contactsNotified = contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        status: "sent",
        sentAt: new Date().toISOString()
      }));
      
      // Save emergency alert
      await storage.createEmergencyAlert({
        userId: req.userId,
        latitude: latitude?.toString(),
        longitude: longitude?.toString(),
        address,
        contactsNotified,
        status: "sent"
      });
      
      res.json({
        status: "sent",
        contactsNotified,
        location: { latitude, longitude, address }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to send emergency alert" });
    }
  });

  // Emergency contacts endpoints
  app.get("/api/emergency-contacts", requireAuth, async (req: any, res) => {
    try {
      const contacts = await storage.getEmergencyContacts(req.userId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to get emergency contacts" });
    }
  });

  app.post("/api/emergency-contacts", requireAuth, async (req: any, res) => {
    try {
      const data = insertEmergencyContactSchema.parse({
        ...req.body,
        userId: req.userId
      });
      const contact = await storage.createEmergencyContact(data);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  app.delete("/api/emergency-contacts/:id", requireAuth, async (req: any, res) => {
    try {
      await storage.deleteEmergencyContact(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // Legal processes endpoints
  app.get("/api/processes", requireAuth, async (req: any, res) => {
    try {
      const processes = await storage.getLegalProcesses(req.userId);
      res.json(processes);
    } catch (error) {
      res.status(500).json({ error: "Failed to get processes" });
    }
  });

  app.post("/api/processes", requireAuth, async (req: any, res) => {
    try {
      const data = insertLegalProcessSchema.parse({
        ...req.body,
        userId: req.userId
      });
      const process = await storage.createLegalProcess(data);
      res.json(process);
    } catch (error) {
      res.status(400).json({ error: "Invalid process data" });
    }
  });

  app.put("/api/processes/:id", requireAuth, async (req: any, res) => {
    try {
      const updates = req.body;
      const process = await storage.updateLegalProcess(parseInt(req.params.id), updates);
      res.json(process);
    } catch (error) {
      res.status(500).json({ error: "Failed to update process" });
    }
  });

  // User profile endpoints
  app.put("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.userId, updates);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Activity endpoints
  app.get("/api/consultations", requireAuth, async (req: any, res) => {
    try {
      const consultations = await storage.getConsultations(req.userId);
      res.json(consultations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get consultations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
