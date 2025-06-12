import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
import { Navbar } from '@/components/navbar';

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
  const { t } = useTranslation();
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

  const processTypes = [
    { value: 'labor', label: t('processes.types.labor') },
    { value: 'civil', label: t('processes.types.civil') },
    { value: 'criminal', label: t('processes.types.criminal') },
    { value: 'family', label: t('processes.types.family') },
    { value: 'commercial', label: t('processes.types.commercial') },
    { value: 'constitutional', label: t('processes.types.constitutional') },
    { value: 'administrative', label: t('processes.types.administrative') },
    { value: 'tax', label: t('processes.types.tax') }
  ];

  const createProcessMutation = useMutation({
    mutationFn: async (newProcess: CreateProcessForm) => {
      const response = await fetch('/api/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProcess),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create process');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/processes'] });
      setShowCreateDialog(false);
      setFormData({ title: '', type: '', description: '', priority: 'medium' });
      toast({
        title: t('processes.processCreated'),
        description: t('processes.processCreated'),
      });
    },
    onError: (error) => {
      console.error('Error creating process:', error);
      toast({
        title: t('common.error'),
        description: t('processes.processCreationFailed'),
        variant: 'destructive',
      });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    return t(`processes.statuses.${status}`) || status;
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
    return t(`processes.priorities.${priority}`) || priority;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProcessMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-neutral-600">{t('common.loading')}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="bg-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('common.back')}
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{t('processes.title')}</h1>
                <p className="text-neutral-600">
                  {t('processes.subtitle')}
                </p>
              </div>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('processes.newProcess')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle>{t('processes.createProcess')}</DialogTitle>
                  <DialogDescription>
                    {t('processes.enterDescription')}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">{t('processes.processTitle')}</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={t('processes.enterTitle')}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">{t('processes.processType')}</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('processes.selectProcessType')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-lg">
                        {processTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="hover:bg-gray-100">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">{t('processes.processDescription')}</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={t('processes.enterDescription')}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priority">{t('processes.priority')}</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('processes.selectPriority')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-lg">
                        <SelectItem value="low" className="hover:bg-gray-100">{t('processes.priorities.low')}</SelectItem>
                        <SelectItem value="medium" className="hover:bg-gray-100">{t('processes.priorities.medium')}</SelectItem>
                        <SelectItem value="high" className="hover:bg-gray-100">{t('processes.priorities.high')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="deadline">{t('processes.deadline')}</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline || ''}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={createProcessMutation.isPending}
                  >
                    {createProcessMutation.isPending ? t('processes.creating') : t('processes.createProcess')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {processes.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-neutral-400 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  {t('processes.noProcesses')}
                </h3>
                <p className="text-neutral-600 text-center mb-4">
                  {t('processes.createFirst')}
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('processes.newProcess')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {processes.map((process) => (
                <Link key={process.id || process._id} href={`/processes/${process.id || process._id}`}>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-white/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(process.status)}
                          <CardTitle className="text-lg text-neutral-900">{process.title}</CardTitle>
                        </div>
                        <Badge variant={getPriorityColor(process.metadata?.priority || 'medium')}>
                          {getPriorityText(process.metadata?.priority || 'medium')}
                        </Badge>
                      </div>
                      <CardDescription className="text-neutral-600">
                        {t(`processes.types.${process.type}`) || process.type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-600">{t('processes.progress')}</span>
                            <span className="text-neutral-900 font-medium">{process.progress}%</span>
                          </div>
                          <Progress value={process.progress} className="h-2" />
                        </div>
                        <div className="flex justify-between text-sm text-neutral-600">
                          <span>{getStatusText(process.status)}</span>
                          <span>{new Date(process.createdAt).toLocaleDateString()}</span>
                        </div>
                        {process.description && (
                          <p className="text-sm text-neutral-600 line-clamp-2">
                            {process.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}