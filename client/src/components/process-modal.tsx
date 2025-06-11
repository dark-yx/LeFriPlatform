import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import type { ProcessDefinition } from '@/types';
import { PROCESS_DEFINITIONS } from '@/types';

interface ProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  processType: string | null;
}

export function ProcessModal({ isOpen, onClose, processType }: ProcessModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  if (!processType || !PROCESS_DEFINITIONS[processType]) {
    return null;
  }

  const process = PROCESS_DEFINITIONS[processType];
  const progress = ((currentStep + 1) / process.totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < process.totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('¡Proceso completado exitosamente!');
      onClose();
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    onClose();
    setCurrentStep(0);
  };

  const currentStepData = process.steps[currentStep] || {
    title: `Paso ${currentStep + 1}`,
    content: '<p>Contenido del paso en desarrollo...</p>',
    completed: false
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{process.title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-1">
            {/* Progress Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-neutral-900">
                  Paso {currentStep + 1}
                </h4>
                <Badge variant="secondary">
                  {currentStep + 1} de {process.totalSteps}
                </Badge>
              </div>
              
              <Progress value={progress} className="h-2" />
              
              <h5 className="text-xl font-semibold text-neutral-900">
                {currentStepData.title}
              </h5>
            </div>

            {/* Step Content */}
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: currentStepData.content }}
            />

            {/* Step Completion */}
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700">
                Marca como completado cuando hayas terminado este paso
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 0}
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button onClick={handleNext} className="bg-blue-500 hover:bg-blue-600">
            {currentStep === process.totalSteps - 1 ? 'Finalizar' : 'Siguiente'}
            {currentStep < process.totalSteps - 1 && (
              <ChevronRight className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
