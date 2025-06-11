import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

interface ProcessFrequentQuestionsProps {
  processType: string;
  onQuestionClick: (question: string) => void;
}

const processQuestions: Record<string, string[]> = {
  divorce: [
    "What documents do I need for divorce proceedings?",
    "How long does the divorce process typically take?",
    "What are the grounds for divorce in my jurisdiction?",
    "How is property divided in a divorce?",
    "What about child custody arrangements?",
    "Do I need to appear in court for my divorce?"
  ],
  contract: [
    "What makes a contract legally binding?",
    "What should I include in a service agreement?",
    "How do I modify an existing contract?",
    "What happens if someone breaches a contract?",
    "Do I need witnesses for my contract?",
    "How do I terminate a contract legally?"
  ],
  lawsuit: [
    "What is the statute of limitations for my case?",
    "What damages can I claim in my lawsuit?",
    "Do I need to attempt mediation first?",
    "What evidence do I need to collect?",
    "How much will filing a lawsuit cost?",
    "What are the chances of winning my case?"
  ],
  inheritance: [
    "How do I probate a will?",
    "What happens if someone dies without a will?",
    "How are inheritance taxes calculated?",
    "Can I contest a will?",
    "What documents do I need for estate administration?",
    "How long does the probate process take?"
  ],
  business: [
    "What business structure should I choose?",
    "What licenses do I need to start my business?",
    "How do I register my business name?",
    "What tax obligations does my business have?",
    "Do I need business insurance?",
    "How do I protect my intellectual property?"
  ],
  employment: [
    "What are my rights if I'm terminated?",
    "How do I file for unemployment benefits?",
    "What constitutes workplace discrimination?",
    "Can my employer change my contract terms?",
    "What should I do about workplace harassment?",
    "Am I entitled to severance pay?"
  ],
  immigration: [
    "What documents do I need for my visa application?",
    "How long does the immigration process take?",
    "Can I work while my application is pending?",
    "What are the requirements for permanent residency?",
    "How do I bring my family to join me?",
    "What happens if my application is denied?"
  ],
  default: [
    "What legal options do I have in this situation?",
    "What documents should I prepare?",
    "What are the potential outcomes?",
    "How long might this process take?",
    "What are the associated costs?",
    "Do I need legal representation?"
  ]
};

export function ProcessFrequentQuestions({ processType, onQuestionClick }: ProcessFrequentQuestionsProps) {
  const questions = processQuestions[processType.toLowerCase()] || processQuestions.default;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Frequent Questions - {processType}
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