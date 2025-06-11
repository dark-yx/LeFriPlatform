import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, FileText, Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

interface ProcessSummary {
  id: string;
  _id?: string;
  title: string;
  type: string;
  description: string;
  status: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  metadata: {
    priority: 'low' | 'medium' | 'high';
    deadline?: string;
  };
}

interface CreateProcessForm {
  title: string;
  type: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
}

export function ProcessList() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState<CreateProcessForm>({
    title: '',
    type: '',
    description: '',
    priority: 'medium'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: processes = [], isLoading } = useQuery<ProcessSummary[]>({
    queryKey: ['/api/processes'],
  });

  const createProcessMutation = useMutation({
    mutationFn: async (data: CreateProcessForm) => {
      const response = await fetch('/api/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error creating process');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/processes'] });
      setShowCreateDialog(false);
      setFormData({ title: '', type: '', description: '', priority: 'medium' });
      toast({ title: 'Proceso creado exitosamente' });
    },
    onError: () => {
      toast({ title: 'Error al crear proceso', variant: 'destructive' });
    }
  });

  const processTypes = [
    { value: 'civil', label: 'Proceso Civil' },
    { value: 'penal', label: 'Proceso Penal' },
    { value: 'laboral', label: 'Proceso Laboral' },
    { value: 'administrativo', label: 'Proceso Administrativo' },
    { value: 'familia', label: 'Derecho de Familia' },
    { value: 'comercial', label: 'Derecho Comercial' },
    { value: 'constitucional', label: 'Proceso Constitucional' },
    { value: 'otros', label: 'Otros' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'in_progress': return 'En Progreso';
      case 'pending': return 'Pendiente';
      default: return 'Desconocido';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Normal';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProcessMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Cargando procesos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Procesos Legales</h1>
            <p className="text-muted-foreground">
              Gestiona tus procesos legales y haz seguimiento a cada paso
            </p>
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Proceso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proceso</DialogTitle>
              <DialogDescription>
                Ingresa los detalles básicos de tu proceso legal
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Título del Proceso</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Demanda por incumplimiento de contrato"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo de Proceso</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {processTypes.map((type, index) => (
                      <SelectItem key={type.value || `type-${index}`} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe brevemente el caso..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deadline">Fecha Límite (Opcional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline || ''}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={createProcessMutation.isPending}
                  className="flex-1"
                >
                  {createProcessMutation.isPending ? 'Creando...' : 'Crear Proceso'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {processes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No tienes procesos legales</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer proceso legal para comenzar a organizarte
            </p>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear Primer Proceso
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processes.map((process, index) => (
            <Card key={process._id || process.id || `process-${index}`} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {process.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {process.description}
                    </CardDescription>
                  </div>
                  <Badge variant={getPriorityColor(process.metadata.priority)}>
                    {getPriorityText(process.metadata.priority)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(process.status)}>
                    {getStatusText(process.status)}
                  </Badge>
                  <Badge variant="outline">
                    {processTypes.find(t => t.value === process.type)?.label || process.type}
                  </Badge>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progreso</span>
                    <span className="text-sm text-muted-foreground">
                      {process.progress}%
                    </span>
                  </div>
                  <Progress value={process.progress} className="h-2" />
                </div>

                {process.metadata.deadline && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Límite: {new Date(process.metadata.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Creado: {new Date(process.createdAt).toLocaleDateString()}
                </div>

                <Link href={`/processes/${process._id || process.id}`}>
                  <Button className="w-full">
                    Ver Detalles
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}