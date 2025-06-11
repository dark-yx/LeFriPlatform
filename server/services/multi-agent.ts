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
Eres un agente especializado en investigación legal. Tu misión es analizar el contexto legal específico del proceso.

CONTEXTO DEL PROCESO:
- Tipo: ${context.type}
- Título: ${context.title}
- Descripción: ${context.description || 'No especificada'}
- Paso actual: ${context.currentStep}/${context.totalSteps}
- País: ${context.country}
- Metadatos: ${JSON.stringify(context.metadata, null, 2)}

ARTÍCULOS CONSTITUCIONALES RELEVANTES:
${constitutionalArticles.map((article, index) => `${index + 1}. ${article}`).join('\n')}

CONSULTA DEL USUARIO:
${query}

Proporciona:
1. Análisis legal específico basado en el contexto del proceso
2. Interpretación de artículos constitucionales aplicables
3. Precedentes legales relevantes
4. Recomendaciones específicas para este caso
5. Nivel de confianza en tu análisis (0-100)

Responde en ${context.language === 'es' ? 'español' : context.language}.
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
        text: 'Error en el análisis legal. Por favor, intenta nuevamente.',
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
Eres un agente especializado en planificación de procesos legales. Tu misión es crear planes detallados y cronogramas.

CONTEXTO DEL PROCESO:
- Tipo: ${context.type}
- Título: ${context.title}
- Descripción: ${context.description || 'No especificada'}
- Paso actual: ${context.currentStep}/${context.totalSteps}
- País: ${context.country}
- Metadatos del caso: ${JSON.stringify(context.metadata, null, 2)}

CONSULTA DEL USUARIO:
${query}

Proporciona:
1. Plan de acción específico para el siguiente paso
2. Cronograma detallado con fechas estimadas
3. Documentos necesarios para cada etapa
4. Recursos requeridos
5. Posibles obstáculos y mitigaciones
6. Próximos pasos recomendados

Responde en ${context.language === 'es' ? 'español' : context.language}.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Generate next steps
      const nextSteps = [
        `Revisar documentación para el paso ${context.currentStep + 1}`,
        'Verificar cumplimiento de requisitos legales',
        'Preparar documentos necesarios',
        'Coordinar con autoridades competentes'
      ];

      return {
        text,
        confidence: 90,
        nextSteps
      };
    } catch (error) {
      console.error('Process planning agent error:', error);
      return {
        text: 'Error en la planificación del proceso. Por favor, intenta nuevamente.',
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