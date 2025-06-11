import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, FileText, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import { ChatInterface } from './chat-interface';
import { useToast } from '@/hooks/use-toast';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  documents: string[];
  requirements: string[];
}

interface ProcessData {
  id: string;
  title: string;
  type: string;
  description: string;
  status: string;
  progress: number;
  steps: ProcessStep[];
  requiredDocuments: string[];
  legalBasis: string;
  constitutionalArticles: string[];
  timeline: string;
  createdAt: string;
  updatedAt: string;
  metadata: {
    caseNumber?: string;
    court?: string;
    judge?: string;
    opposingParty?: string;
    amount?: string;
    deadline?: string;
    priority: 'low' | 'medium' | 'high';
  };
}

interface ProcessDetailProps {
  processId: string;
  country: string;
}

export function ProcessDetail({ processId, country }: ProcessDetailProps) {
  const [showChat, setShowChat] = useState(false);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: processData, isLoading } = useQuery<ProcessData>({
    queryKey: ['/api/processes', processId],
    queryFn: async () => {
      const response = await fetch(`/api/processes/${processId}`, {
        headers: { 'x-user-id': '66a1b2c3d4e5f6789abc1234' }
      });
      if (!response.ok) throw new Error('Failed to fetch process');
      return response.json();
    },
    enabled: !!processId
  });

  const updateProcessMutation = useMutation({
    mutationFn: async (updates: Partial<ProcessData>) => {
      if (!processId) throw new Error('Process ID is required');
      const response = await fetch(`/api/processes/${processId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': '66a1b2c3d4e5f6789abc1234'
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Error updating process');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/processes', processId] });
      queryClient.invalidateQueries({ queryKey: ['/api/processes'] });
      toast({ title: 'Proceso actualizado correctamente' });
    },
  });

  const toggleStepMutation = useMutation({
    mutationFn: async ({ stepId, completed }: { stepId: string; completed: boolean }) => {
      const updatedSteps = processData?.steps.map(step =>
        step.id === stepId ? { ...step, completed } : step
      ) || [];
      
      const completedSteps = updatedSteps.filter(step => step.completed).length;
      const progress = Math.round((completedSteps / updatedSteps.length) * 100);
      
      return updateProcessMutation.mutateAsync({
        steps: updatedSteps,
        progress,
        status: progress === 100 ? 'completed' : 'in_progress'
      });
    },
    onSuccess: () => {
      toast({ title: 'Paso actualizado' });
    },
  });

  const generateDocumentMutation = useMutation({
    mutationFn: async () => {
      if (!processId) throw new Error('Process ID is required');
      const response = await fetch(`/api/processes/${processId}/generate-document`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': '66a1b2c3d4e5f6789abc1234'
        },
        body: JSON.stringify({ country }),
      });
      if (!response.ok) throw new Error('Error generating document');
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${processData?.title || 'documento'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: 'Documento generado y descargado' });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Cargando proceso...</p>
        </div>
      </div>
    );
  }

  if (!processData) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
          <p>No se pudo cargar el proceso</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{processData.title}</CardTitle>
              <CardDescription>{processData.description}</CardDescription>
              <div className="flex gap-2 mt-2">
                <Badge variant={processData.status === 'completed' ? 'default' : 'secondary'}>
                  {processData.status === 'completed' ? 'Completado' : 
                   processData.status === 'in_progress' ? 'En Progreso' : 'Pendiente'}
                </Badge>
                <Badge variant={
                  processData.metadata?.priority === 'high' ? 'destructive' :
                  processData.metadata?.priority === 'medium' ? 'secondary' : 'outline'
                }>
                  {processData.metadata?.priority === 'high' ? 'Alta Prioridad' :
                   processData.metadata?.priority === 'medium' ? 'Prioridad Media' : 'Baja Prioridad'}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowChat(!showChat)}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Chat IA
              </Button>
              <Button
                onClick={() => generateDocumentMutation.mutate()}
                disabled={generateDocumentMutation.isPending}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {generateDocumentMutation.isPending ? 'Generando...' : 'Generar Documento'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Progreso del Proceso</Label>
              <Progress value={processData.progress} className="mt-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {processData.progress}% completado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información del Caso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Número de Caso</Label>
              <Input
                value={processData.metadata?.caseNumber || ''}
                onChange={(e) => {
                  const metadata = { ...(processData.metadata || {}), caseNumber: e.target.value };
                  updateProcessMutation.mutate({ metadata });
                }}
                placeholder="Ingrese número de caso"
              />
            </div>
            <div>
              <Label>Tribunal</Label>
              <Input
                value={processData.metadata?.court || ''}
                onChange={(e) => {
                  const metadata = { ...(processData.metadata || {}), court: e.target.value };
                  updateProcessMutation.mutate({ metadata });
                }}
                placeholder="Tribunal competente"
              />
            </div>
            <div>
              <Label>Juez</Label>
              <Input
                value={processData.metadata?.judge || ''}
                onChange={(e) => {
                  const metadata = { ...(processData.metadata || {}), judge: e.target.value };
                  updateProcessMutation.mutate({ metadata });
                }}
                placeholder="Nombre del juez"
              />
            </div>
            <div>
              <Label>Parte Contraria</Label>
              <Input
                value={processData.metadata?.opposingParty || ''}
                onChange={(e) => {
                  const metadata = { ...(processData.metadata || {}), opposingParty: e.target.value };
                  updateProcessMutation.mutate({ metadata });
                }}
                placeholder="Nombre de la parte contraria"
              />
            </div>
            <div>
              <Label>Monto en Disputa</Label>
              <Input
                value={processData.metadata?.amount || ''}
                onChange={(e) => {
                  const metadata = { ...(processData.metadata || {}), amount: e.target.value };
                  updateProcessMutation.mutate({ metadata });
                }}
                placeholder="Monto económico"
              />
            </div>
            <div>
              <Label>Fecha Límite</Label>
              <Input
                type="date"
                value={processData.metadata?.deadline || ''}
                onChange={(e) => {
                  const metadata = { ...(processData.metadata || {}), deadline: e.target.value };
                  updateProcessMutation.mutate({ metadata });
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Legal Basis */}
        <Card>
          <CardHeader>
            <CardTitle>Base Legal</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                <div>
                  <Label>Legal Foundation</Label>
                  <div 
                    className="mt-1 p-4 border rounded-md bg-white min-h-[200px] prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: processData.legalBasis || '' }}
                  />
                </div>
                <div>
                  <Label>Artículos Constitucionales</Label>
                  <div className="mt-2 space-y-2">
                    {(processData.constitutionalArticles || []).map((article, index) => (
                      <Badge key={index} variant="outline" className="block p-2 text-sm">
                        {article}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos Requeridos</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {(processData.requiredDocuments || []).map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <Checkbox id={`doc-${index}`} />
                    <Label htmlFor={`doc-${index}`} className="text-sm">
                      {doc}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Process Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Pasos del Proceso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(processData.steps || []).map((step, index) => (
              <div key={step.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={step.completed}
                    onCheckedChange={(checked) => 
                      toggleStepMutation.mutate({ 
                        stepId: step.id, 
                        completed: checked as boolean 
                      })
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{step.title}</h4>
                      <Badge variant={step.completed ? 'default' : 'secondary'}>
                        Paso {index + 1}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                    {step.dueDate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Fecha límite: {new Date(step.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    {(step.requirements || []).length > 0 && (
                      <div className="mt-2">
                        <Label className="text-xs">Requisitos:</Label>
                        <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                          {(step.requirements || []).map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-current rounded-full" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {(step.documents || []).length > 0 && (
                      <div className="mt-2">
                        <Label className="text-xs">Documentos necesarios:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(step.documents || []).map((doc, docIndex) => (
                            <Badge key={docIndex} variant="outline" className="text-xs">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {showChat && (
        <Card>
          <CardHeader>
            <CardTitle>Consulta con IA sobre el Proceso</CardTitle>
            <CardDescription>
              Haz preguntas específicas sobre tu proceso legal y recibe orientación personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChatInterface country={country} processId={processId} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}