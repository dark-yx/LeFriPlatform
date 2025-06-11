import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiResponse {
  text: string;
  error?: string;
}

export interface ConsultationContext {
  query: string;
  country: string;
  language: string;
  constitutionalArticles?: string[];
  legalDocuments?: string[];
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateLegalResponse(context: ConsultationContext): Promise<GeminiResponse> {
    try {
      const prompt = this.buildLegalPrompt(context);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return { text };
    } catch (error) {
      console.error('Gemini API error:', error);
      return { 
        text: 'Lo siento, no pude procesar tu consulta en este momento. Por favor, intenta nuevamente.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async generateLegalResponseStream(context: ConsultationContext & { onChunk?: (chunk: string) => void }): Promise<GeminiResponse> {
    try {
      const prompt = this.buildLegalPrompt(context);
      const result = await this.model.generateContentStream(prompt);
      
      let fullText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        if (context.onChunk) {
          context.onChunk(chunkText);
        }
      }
      
      return { text: fullText };
    } catch (error) {
      console.error('Gemini streaming error:', error);
      const fallbackText = 'Lo siento, no pude procesar tu consulta en este momento. Por favor, intenta nuevamente.';
      this.simulateStreamingText(fallbackText, context.onChunk);
      return { 
        text: fallbackText,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private simulateStreamingText(text: string, onChunk?: (chunk: string) => void): void {
    if (!onChunk) return;
    
    const words = text.split(' ');
    let currentIndex = 0;
    
    const sendChunk = () => {
      if (currentIndex < words.length) {
        const chunkSize = Math.floor(Math.random() * 3) + 1; // 1-3 words per chunk
        const chunk = words.slice(currentIndex, currentIndex + chunkSize).join(' ') + ' ';
        onChunk(chunk);
        currentIndex += chunkSize;
        
        // Random delay between 50-150ms for realistic typing
        setTimeout(sendChunk, Math.random() * 100 + 50);
      }
    };
    
    sendChunk();
  }

  async generateEmergencyMessage(context: {
    userName: string;
    location: { latitude: number; longitude: number; address?: string };
    language: string;
  }): Promise<GeminiResponse> {
    try {
      const prompt = this.buildEmergencyPrompt(context);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return { text };
    } catch (error) {
      console.error('Gemini API error for emergency:', error);
      return {
        text: this.getFallbackEmergencyMessage(context),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async generateProcessStep(context: {
    processType: string;
    currentStep: number;
    userData: any;
    language: string;
  }): Promise<GeminiResponse> {
    try {
      const prompt = this.buildProcessPrompt(context);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return { text };
    } catch (error) {
      console.error('Gemini API error for process:', error);
      return {
        text: 'Error generando el siguiente paso del proceso.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildLegalPrompt(context: ConsultationContext): string {
    const { query, country, language, constitutionalArticles, legalDocuments } = context;
    
    let prompt = `Eres un asistente legal especializado en las leyes de ${country}. 
Responde en ${language === 'es' ? 'español' : language === 'en' ? 'inglés' : 'francés'}.

Consulta legal: ${query}

País: ${country}

`;

    if (constitutionalArticles && constitutionalArticles.length > 0) {
      prompt += `Artículos constitucionales relevantes:
${constitutionalArticles.join('\n\n')}

`;
    }

    if (legalDocuments && legalDocuments.length > 0) {
      prompt += `Documentos legales relevantes:
${legalDocuments.join('\n\n')}

`;
    }

    prompt += `Instrucciones:
1. Proporciona una respuesta legal precisa y contextualizada
2. Cita los artículos o leyes específicas cuando sea relevante
3. Incluye pasos prácticos que el usuario puede seguir
4. Si la consulta requiere asesoría especializada, recomienda consultar un abogado
5. Mantén un tono profesional pero accesible
6. Si no tienes información específica sobre ${country}, indícalo claramente

Respuesta:`;

    return prompt;
  }

  private buildEmergencyPrompt(context: {
    userName: string;
    location: { latitude: number; longitude: number; address?: string };
    language: string;
  }): string {
    const { userName, location, language } = context;
    
    return `Genera un mensaje de emergencia urgente en ${language === 'es' ? 'español' : language === 'en' ? 'inglés' : 'francés'}.

Información:
- Persona: ${userName}
- Ubicación: ${location.address || `Lat: ${location.latitude}, Lng: ${location.longitude}`}
- Coordenadas: ${location.latitude}, ${location.longitude}

El mensaje debe:
1. Ser claro y directo sobre la emergencia
2. Incluir la ubicación exacta
3. Pedir ayuda inmediata
4. Ser conciso (máximo 160 caracteres para WhatsApp)
5. Incluir un enlace de Google Maps: https://maps.google.com/maps?q=${location.latitude},${location.longitude}

Genera solo el mensaje, sin explicaciones adicionales.`;
  }

  private buildProcessPrompt(context: {
    processType: string;
    currentStep: number;
    userData: any;
    language: string;
  }): string {
    const { processType, currentStep, userData, language } = context;
    
    return `Genera contenido para el paso ${currentStep + 1} del proceso legal "${processType}".

Idioma: ${language === 'es' ? 'español' : language === 'en' ? 'inglés' : 'francés'}

Datos del usuario: ${JSON.stringify(userData)}

Instrucciones:
1. Proporciona instrucciones claras y específicas para este paso
2. Lista los documentos necesarios si aplica
3. Incluye formularios o plantillas si es relevante
4. Menciona plazos legales importantes
5. Advierte sobre errores comunes
6. Formato HTML válido para mostrar en la interfaz

Genera el contenido del paso:`;
  }

  private getFallbackEmergencyMessage(context: {
    userName: string;
    location: { latitude: number; longitude: number; address?: string };
    language: string;
  }): string {
    const { userName, location, language } = context;
    
    if (language === 'en') {
      return `🚨 EMERGENCY: ${userName} needs immediate help! Location: ${location.address || `${location.latitude}, ${location.longitude}`} https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
    } else if (language === 'fr') {
      return `🚨 URGENCE: ${userName} a besoin d'aide immédiate! Localisation: ${location.address || `${location.latitude}, ${location.longitude}`} https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
    } else {
      return `🚨 EMERGENCIA: ${userName} necesita ayuda inmediata! Ubicación: ${location.address || `${location.latitude}, ${location.longitude}`} https://maps.google.com/maps?q=${location.latitude},${location.longitude}`;
    }
  }
}

export const geminiService = new GeminiService();