export interface WhatsAppMessage {
  to: string;
  message: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'video' | 'document';
}

export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class WhatsAppService {
  private apiUrl: string;
  private phoneNumber: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'http://localhost:3001';
    this.phoneNumber = process.env.WHATSAPP_PHONE_NUMBER || '';
  }

  async sendMessage(message: WhatsAppMessage): Promise<WhatsAppResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: message.to,
          message: message.message,
          mediaUrl: message.mediaUrl,
          mediaType: message.mediaType,
        }),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        messageId: data.messageId,
      };
    } catch (error) {
      console.error('WhatsApp send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendEmergencyAlert(params: {
    contacts: Array<{ phone: string; name: string }>;
    message: string;
    location?: { latitude: number; longitude: number };
    voiceNoteUrl?: string;
  }): Promise<Array<{ phone: string; name: string; success: boolean; error?: string }>> {
    const results = [];

    for (const contact of params.contacts) {
      let messageToSend = params.message;
      
      // Add location link if provided
      if (params.location) {
        const mapsUrl = `https://maps.google.com/maps?q=${params.location.latitude},${params.location.longitude}`;
        messageToSend += `\n\nUbicación: ${mapsUrl}`;
      }

      // Send text message
      const textResult = await this.sendMessage({
        to: contact.phone,
        message: messageToSend,
      });

      // Send voice note if provided
      if (params.voiceNoteUrl && textResult.success) {
        await this.sendMessage({
          to: contact.phone,
          message: '🎤 Nota de voz de emergencia:',
          mediaUrl: params.voiceNoteUrl,
          mediaType: 'audio',
        });
      }

      results.push({
        phone: contact.phone,
        name: contact.name,
        success: textResult.success,
        error: textResult.error,
      });
    }

    return results;
  }

  async sendVoiceNote(params: {
    to: string;
    audioUrl: string;
    caption?: string;
  }): Promise<WhatsAppResponse> {
    return this.sendMessage({
      to: params.to,
      message: params.caption || 'Nota de voz',
      mediaUrl: params.audioUrl,
      mediaType: 'audio',
    });
  }

  isConfigured(): boolean {
    return !!(this.apiUrl && this.phoneNumber);
  }
}

export const whatsAppService = new WhatsAppService();