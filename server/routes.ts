import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEmergencyContactSchema, insertLegalProcessSchema, insertConsultationSchema, insertEmergencyAlertSchema } from "@shared/schema";
import { geminiService } from "./services/gemini";
import { constituteService } from "./services/constitute";
import { whatsAppService } from "./services/whatsapp";
import { emailService } from "./services/email";
import { voiceService } from "./services/voice";
import multer from 'multer';

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });

  // Auth middleware (simplified for demo)
  const requireAuth = (req: any, res: any, next: any) => {
    const userId = req.headers['x-user-id'] || '66a1b2c3d4e5f6789abc1234'; // Demo user
    req.userId = userId as string;
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

  // Legal consultation endpoints with streaming
  app.post("/api/ask", requireAuth, async (req: any, res) => {
    try {
      const { query, country, language } = req.body;
      
      // Set headers for Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      // Get relevant constitutional articles
      const constitutionalArticles = await constituteService.getRelevantArticles({
        query,
        country,
        language: language || "es",
        limit: 3
      });

      // Create citations from constitutional articles
      const citations = constitutionalArticles.map((article, index) => ({
        title: `Artículo Constitucional ${index + 1}`,
        url: `#article-${index + 1}`,
        relevance: Math.max(95 - index * 5, 75)
      }));

      // Add fallback citations if no constitutional articles found
      if (citations.length === 0) {
        citations.push(
          { title: "Constitución Nacional", url: "#", relevance: 90 },
          { title: "Código Civil", url: "#", relevance: 85 }
        );
      }

      // Send initial data
      res.write(`data: ${JSON.stringify({ 
        type: 'citations', 
        data: { citations, constitutionalArticles: constitutionalArticles.slice(0, 2) }
      })}\n\n`);

      // Generate AI response with streaming
      const aiResponse = await geminiService.generateLegalResponseStream({
        query,
        country: country || "EC",
        language: language || "es",
        constitutionalArticles,
        onChunk: (chunk: string) => {
          res.write(`data: ${JSON.stringify({ type: 'chunk', data: chunk })}\n\n`);
        }
      });
      
      // Save consultation
      await storage.createConsultation({
        userId: req.userId,
        query,
        response: aiResponse.text,
        country: country || "EC",
        language: language || "es"
      });

      // Send completion event
      res.write(`data: ${JSON.stringify({ 
        type: 'complete', 
        data: { 
          confidence: aiResponse.error ? 0.5 : 0.92
        } 
      })}\n\n`);
      
      res.end();
    } catch (error) {
      console.error('Consultation error:', error);
      res.write(`data: ${JSON.stringify({ 
        type: 'error', 
        data: { error: "Failed to process consultation" }
      })}\n\n`);
      res.end();
    }
  });

  // Emergency endpoints
  app.post("/api/emergency", requireAuth, async (req: any, res) => {
    try {
      const { latitude, longitude, address } = req.body;
      
      // Get user and contacts
      const user = await storage.getUser(req.userId);
      const contacts = await storage.getEmergencyContacts(req.userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate emergency message with AI
      const emergencyMessage = await geminiService.generateEmergencyMessage({
        userName: user.name,
        location: { latitude, longitude, address },
        language: user.language
      });

      // Send WhatsApp alerts
      const whatsappContacts = contacts.filter(contact => contact.whatsappEnabled);
      const whatsappResults = await whatsAppService.sendEmergencyAlert({
        contacts: whatsappContacts.map(c => ({ phone: c.phone, name: c.name })),
        message: emergencyMessage.text,
        location: { latitude, longitude }
      });

      // Send email alerts to all contacts
      const emailResults = [];
      for (const contact of contacts) {
        if (contact.phone.includes('@')) { // Assuming email format
          const emailResult = await emailService.sendEmergencyEmail({
            to: contact.phone,
            userName: user.name,
            message: emergencyMessage.text,
            location: { latitude, longitude, address }
          });
          emailResults.push({
            phone: contact.phone,
            name: contact.name,
            success: emailResult.success,
            error: emailResult.error
          });
        }
      }

      // Combine results
      const allResults = [...whatsappResults, ...emailResults];
      const contactsNotified = allResults.map(result => ({
        id: Date.now() + Math.random(),
        name: result.name,
        phone: result.phone,
        status: result.success ? "sent" : "failed",
        sentAt: new Date().toISOString(),
        error: result.error
      }));
      
      // Save emergency alert
      await storage.createEmergencyAlert({
        userId: req.userId,
        latitude: latitude?.toString(),
        longitude: longitude?.toString(),
        address,
        contactsNotified,
        status: contactsNotified.some(c => c.status === "sent") ? "sent" : "failed"
      });
      
      res.json({
        status: contactsNotified.some(c => c.status === "sent") ? "sent" : "failed",
        contactsNotified,
        location: { latitude, longitude, address },
        message: emergencyMessage.text
      });
    } catch (error) {
      console.error('Emergency alert error:', error);
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

  // Voice recording endpoints
  app.post("/api/voice/upload", requireAuth, upload.single('audio'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      const { type = 'emergency' } = req.body;
      const recording = await voiceService.saveVoiceRecording({
        userId: req.userId,
        audioBuffer: req.file.buffer,
        type,
        originalName: req.file.originalname
      });

      res.json({
        id: recording.id,
        url: voiceService.getVoiceRecordingUrl(recording.id),
        filename: recording.filename
      });
    } catch (error) {
      console.error('Voice upload error:', error);
      res.status(500).json({ error: "Failed to save voice recording" });
    }
  });

  app.get("/api/voice/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const audioBuffer = await voiceService.getVoiceRecording(id);
      
      if (!audioBuffer) {
        return res.status(404).json({ error: "Voice recording not found" });
      }

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', `inline; filename="${id}.mp3"`);
      res.send(audioBuffer);
    } catch (error) {
      console.error('Voice retrieval error:', error);
      res.status(500).json({ error: "Failed to retrieve voice recording" });
    }
  });

  // Enhanced emergency endpoint with voice recording
  app.post("/api/emergency/with-voice", requireAuth, upload.single('voiceNote'), async (req: any, res) => {
    try {
      const { latitude, longitude, address } = req.body;
      
      // Get user and contacts
      const user = await storage.getUser(req.userId);
      const contacts = await storage.getEmergencyContacts(req.userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Save voice recording if provided
      let voiceRecording = null;
      if (req.file) {
        voiceRecording = await voiceService.saveVoiceRecording({
          userId: req.userId,
          audioBuffer: req.file.buffer,
          type: 'emergency',
          originalName: req.file.originalname
        });
      }

      // Generate emergency message
      const emergencyMessage = await geminiService.generateEmergencyMessage({
        userName: user.name,
        location: { latitude, longitude, address },
        language: user.language
      });

      // Send WhatsApp alerts with voice note
      const whatsappContacts = contacts.filter(contact => contact.whatsappEnabled);
      const voiceUrl = voiceRecording ? `${process.env.APP_URL || 'http://localhost:5000'}${voiceService.getVoiceRecordingUrl(voiceRecording.id)}` : undefined;
      
      const whatsappResults = await whatsAppService.sendEmergencyAlert({
        contacts: whatsappContacts.map(c => ({ phone: c.phone, name: c.name })),
        message: emergencyMessage.text,
        location: { latitude, longitude },
        voiceNoteUrl: voiceUrl
      });

      // Send email alerts with voice attachment
      const emailResults = [];
      for (const contact of contacts) {
        if (contact.phone.includes('@')) {
          const emailResult = await emailService.sendEmergencyEmail({
            to: contact.phone,
            userName: user.name,
            message: emergencyMessage.text,
            location: { latitude, longitude, address },
            voiceNoteAttachment: voiceRecording ? {
              filename: voiceRecording.filename,
              content: await voiceService.getVoiceRecording(voiceRecording.id) || Buffer.alloc(0)
            } : undefined
          });
          emailResults.push({
            phone: contact.phone,
            name: contact.name,
            success: emailResult.success,
            error: emailResult.error
          });
        }
      }

      // Combine results
      const allResults = [...whatsappResults, ...emailResults];
      const contactsNotified = allResults.map(result => ({
        id: Date.now() + Math.random(),
        name: result.name,
        phone: result.phone,
        status: result.success ? "sent" : "failed",
        sentAt: new Date().toISOString(),
        error: result.error
      }));
      
      // Save emergency alert
      await storage.createEmergencyAlert({
        userId: req.userId,
        latitude: latitude?.toString(),
        longitude: longitude?.toString(),
        address,
        contactsNotified,
        status: contactsNotified.some(c => c.status === "sent") ? "sent" : "failed"
      });
      
      res.json({
        status: contactsNotified.some(c => c.status === "sent") ? "sent" : "failed",
        contactsNotified,
        location: { latitude, longitude, address },
        message: emergencyMessage.text,
        voiceRecording: voiceRecording ? {
          id: voiceRecording.id,
          url: voiceService.getVoiceRecordingUrl(voiceRecording.id)
        } : null
      });
    } catch (error) {
      console.error('Emergency with voice error:', error);
      res.status(500).json({ error: "Failed to send emergency alert with voice" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
