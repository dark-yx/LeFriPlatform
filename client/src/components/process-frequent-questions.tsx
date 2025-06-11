import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

interface ProcessFrequentQuestionsProps {
  processType: string;
  onQuestionClick: (question: string) => void;
}

const processQuestions: Record<string, string[]> = {
  divorcio: [
    "¿Qué documentos necesito para el proceso de divorcio?",
    "¿Cuánto tiempo toma típicamente el proceso de divorcio?",
    "¿Cuáles son las causales de divorcio en mi jurisdicción?",
    "¿Cómo se divide la propiedad en un divorcio?",
    "¿Qué pasa con la custodia de los hijos?",
    "¿Necesito comparecer en corte para mi divorcio?"
  ],
  contrato: [
    "¿Qué hace que un contrato sea legalmente vinculante?",
    "¿Qué debo incluir en un acuerdo de servicios?",
    "¿Cómo modifico un contrato existente?",
    "¿Qué pasa si alguien incumple un contrato?",
    "¿Necesito testigos para mi contrato?",
    "¿Cómo termino un contrato legalmente?"
  ],
  laboral: [
    "¿Cuál es el plazo de prescripción para mi caso?",
    "¿Qué daños puedo reclamar en mi demanda?",
    "¿Necesito intentar mediación primero?",
    "¿Qué evidencia necesito recopilar?",
    "¿Cuánto cuesta presentar una demanda?",
    "¿Cuáles son las posibilidades de ganar mi caso?"
  ],
  herencia: [
    "¿Cómo tramito la legalización de un testamento?",
    "¿Qué pasa si alguien muere sin testamento?",
    "¿Cómo se calculan los impuestos de herencia?",
    "¿Puedo impugnar un testamento?",
    "¿Qué documentos necesito para la administración de bienes?",
    "¿Cuánto tiempo toma el proceso de sucesión?"
  ],
  empresa: [
    "¿Qué estructura empresarial debo elegir?",
    "¿Qué licencias necesito para iniciar mi negocio?",
    "¿Cómo registro el nombre de mi empresa?",
    "¿Qué obligaciones fiscales tiene mi negocio?",
    "¿Necesito seguro empresarial?",
    "¿Cómo protejo mi propiedad intelectual?"
  ],
  empleo: [
    "¿Cuáles son mis derechos si me despiden?",
    "¿Cómo solicito beneficios de desempleo?",
    "¿Qué constituye discriminación laboral?",
    "¿Puede mi empleador cambiar los términos de mi contrato?",
    "¿Qué debo hacer sobre acoso laboral?",
    "¿Tengo derecho a indemnización?"
  ],
  inmigracion: [
    "¿Qué documentos necesito para mi solicitud de visa?",
    "¿Cuánto tiempo toma el proceso de inmigración?",
    "¿Puedo trabajar mientras mi solicitud está pendiente?",
    "¿Cuáles son los requisitos para residencia permanente?",
    "¿Cómo traigo a mi familia a acompañarme?",
    "¿Qué pasa si rechazan mi solicitud?"
  ],
  default: [
    "¿Qué opciones legales tengo en esta situación?",
    "¿Qué documentos debo preparar?",
    "¿Cuáles son los posibles resultados?",
    "¿Cuánto tiempo podría tomar este proceso?",
    "¿Cuáles son los costos asociados?",
    "¿Necesito representación legal?"
  ]
};

export function ProcessFrequentQuestions({ processType, onQuestionClick }: ProcessFrequentQuestionsProps) {
  const questions = processQuestions[processType.toLowerCase()] || processQuestions.default;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Temas Frecuentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {questions.map((question, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left h-auto p-3 whitespace-normal"
              onClick={() => onQuestionClick(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}