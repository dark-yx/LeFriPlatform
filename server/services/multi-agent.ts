import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiService } from './gemini';
import { constituteService } from './constitute';

export interface AgentResponse {
  text: string;
  confidence: number;
  citations?: string[];
  nextSteps?: string[];
  error?: string;
}

export interface ProcessContext {
  processId: string;
  title: string;
  type: string;
  description?: string;
  currentStep: number;
  totalSteps: number;
  metadata?: any;
  country: string;
  language: string;
}

export class MultiAgentService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // Legal Research Agent
  async legalResearchAgent(query: string, context: ProcessContext): Promise<AgentResponse> {
    try {
      // Get relevant constitutional articles
      const constitutionalArticles = await constituteService.getRelevantArticles({
        query: `${query} ${context.title} ${context.description}`,
        country: context.country,
        language: context.language,
        limit: 5
      });

      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
You are a legal research agent specialized in analyzing specific legal process contexts.

PROCESS CONTEXT:
- Type: ${context.type}
- Title: ${context.title}
- Description: ${context.description || 'Not specified'}
- Current step: ${context.currentStep}/${context.totalSteps}
- Country: ${context.country}
- Metadata: ${JSON.stringify(context.metadata, null, 2)}

RELEVANT CONSTITUTIONAL ARTICLES:
${constitutionalArticles.map((article, index) => `${index + 1}. ${article}`).join('\n')}

USER QUERY:
${query}

Provide:
1. Specific legal analysis based on the process context
2. Interpretation of applicable constitutional articles
3. Relevant legal precedents
4. Specific recommendations for this case
5. Confidence level in your analysis (0-100)

Respond in ${context.language === 'es' ? 'Spanish' : 'English'}.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        text,
        confidence: 85,
        citations: constitutionalArticles.slice(0, 3)
      };
    } catch (error) {
      console.error('Legal research agent error:', error);
      return {
        text: 'Error in legal analysis. Please try again.',
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Process Planning Agent
  async processPlanningAgent(query: string, context: ProcessContext): Promise<AgentResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
You are a legal process planning agent specialized in creating detailed plans and timelines.

PROCESS CONTEXT:
- Type: ${context.type}
- Title: ${context.title}
- Description: ${context.description || 'Not specified'}
- Current step: ${context.currentStep}/${context.totalSteps}
- Country: ${context.country}
- Case metadata: ${JSON.stringify(context.metadata, null, 2)}

USER QUERY:
${query}

Provide:
1. Specific action plan for the next step
2. Detailed timeline with estimated dates
3. Documents needed for each stage
4. Required resources
5. Potential obstacles and mitigations
6. Recommended next steps

Respond in ${context.language === 'es' ? 'Spanish' : 'English'}.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Generate next steps
      const nextSteps = [
        `Review documentation for step ${context.currentStep + 1}`,
        'Verify compliance with legal requirements',
        'Prepare necessary documents',
        'Coordinate with competent authorities'
      ];

      return {
        text,
        confidence: 90,
        nextSteps
      };
    } catch (error) {
      console.error('Process planning agent error:', error);
      return {
        text: 'Error in process planning. Please try again.',
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Document Generation Agent
  async documentGenerationAgent(query: string, context: ProcessContext): Promise<AgentResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
Eres un agente especializado en generación de documentos legales. Tu misión es crear documentos formales y precisos.

CONTEXTO DEL PROCESO:
- Tipo: ${context.type}
- Título: ${context.title}
- Descripción: ${context.description || 'No especificada'}
- País: ${context.country}
- Metadatos: ${JSON.stringify(context.metadata, null, 2)}

CONSULTA DEL USUARIO:
${query}

Genera:
1. Estructura del documento legal requerido
2. Contenido específico basado en el caso
3. Fundamentos legales y constitucionales
4. Formato apropiado para el tipo de documento
5. Lista de verificación para completar el documento

Responde en ${context.language === 'es' ? 'español' : context.language}.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        text,
        confidence: 88,
        citations: ['Código Civil', 'Constitución Nacional', 'Jurisprudencia aplicable']
      };
    } catch (error) {
      console.error('Document generation agent error:', error);
      return {
        text: 'Error en la generación de documentos. Por favor, intenta nuevamente.',
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Coordinator Agent - Routes queries to appropriate specialized agents
  async coordinatorAgent(query: string, context: ProcessContext): Promise<AgentResponse> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // Determine which agent(s) to use based on query intent
      const intentPrompt = `
Analiza la siguiente consulta y determina qué tipo de asistencia necesita el usuario:

CONSULTA: "${query}"
CONTEXTO: Proceso legal de tipo "${context.type}" en paso ${context.currentStep}/${context.totalSteps}

Opciones:
1. RESEARCH - Necesita investigación legal, interpretación de leyes, precedentes
2. PLANNING - Necesita planificación de pasos, cronogramas, organización del proceso
3. DOCUMENT - Necesita generar, revisar o estructurar documentos legales
4. GENERAL - Consulta general que requiere múltiples agentes

Responde SOLO con una de estas opciones: RESEARCH, PLANNING, DOCUMENT, o GENERAL
`;

      const intentResult = await model.generateContent(intentPrompt);
      const intent = (await intentResult.response.text()).trim().toUpperCase();

      switch (intent) {
        case 'RESEARCH':
          return await this.legalResearchAgent(query, context);
        
        case 'PLANNING':
          return await this.processPlanningAgent(query, context);
        
        case 'DOCUMENT':
          return await this.documentGenerationAgent(query, context);
        
        case 'GENERAL':
        default:
          // Use multiple agents for comprehensive response
          const [research, planning] = await Promise.all([
            this.legalResearchAgent(query, context),
            this.processPlanningAgent(query, context)
          ]);

          const combinedText = `
## Análisis Legal
${research.text}

## Planificación del Proceso
${planning.text}
`;

          return {
            text: combinedText,
            confidence: Math.round((research.confidence + planning.confidence) / 2),
            citations: [...(research.citations || []), ...(planning.citations || [])],
            nextSteps: planning.nextSteps
          };
      }
    } catch (error) {
      console.error('Coordinator agent error:', error);
      return {
        text: 'Error en la coordinación de agentes. Por favor, intenta nuevamente.',
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Main entry point for process-specific chat
  async processChat(query: string, context: ProcessContext): Promise<AgentResponse> {
    return await this.coordinatorAgent(query, context);
  }
}

export const multiAgentService = new MultiAgentService();