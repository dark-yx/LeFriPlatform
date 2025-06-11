import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { MessageSquare, FileText, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: recentConsultations } = useQuery({
    queryKey: ['/api/consultations'],
    queryFn: async () => {
      const response = await api.getConsultations();
      return await response.json();
    },
  });

  const { data: activeProcesses } = useQuery({
    queryKey: ['/api/processes'],
    queryFn: async () => {
      const response = await api.getProcesses();
      return await response.json();
    },
  });

  const modeCards = [
    {
      title: 'Consultation Mode',
      description: 'Ask legal questions and get contextualized answers by country using advanced AI.',
      icon: MessageSquare,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      buttonColor: 'text-blue-500',
      onClick: () => setLocation('/consulta'),
    },
    {
      title: 'Process Mode',
      description: 'Step-by-step guidance for common legal processes like divorce, contracts and lawsuits.',
      icon: FileText,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      buttonColor: 'text-orange-600',
      onClick: () => setLocation('/processes'),
    },
    {
      title: 'Emergency Mode',
      description: 'Automatic alert system via WhatsApp to your emergency contacts.',
      icon: AlertTriangle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      buttonColor: 'text-red-500',
      onClick: () => setLocation('/emergencia'),
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">
              Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
            </h2>
            <p className="text-blue-100 text-lg">
              Your intelligent legal assistant is ready to help with consultations, processes and emergencies.
            </p>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modeCards.map((card) => (
              <Card 
                key={card.title}
                className="card-hover cursor-pointer border border-neutral-200"
                onClick={card.onClick}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <card.icon className={`${card.iconColor} w-6 h-6`} />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-neutral-600 mb-4 text-sm leading-relaxed">
                    {card.description}
                  </p>
                  <div className={`flex items-center ${card.buttonColor} text-sm font-medium`}>
                    <span>
                      {card.title === 'Consultation Mode' && 'Start consultation'}
                      {card.title === 'Process Mode' && 'View processes'}
                      {card.title === 'Emergency Mode' && 'Setup alerts'}
                    </span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentConsultations?.slice(0, 3).map((consultation: any, index: number) => (
                  <div key={consultation.id || `consultation-${index}`} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {consultation.query}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {new Date(consultation.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-neutral-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay consultas recientes</p>
                    <Button 
                      variant="link" 
                      className="text-blue-500 mt-2"
                      onClick={() => setLocation('/consulta')}
                    >
                      Realizar primera consulta
                    </Button>
                  </div>
                )}

                {activeProcesses?.length > 0 && (
                  <>
                    {activeProcesses.slice(0, 2).map((process: any, index: number) => (
                      <div key={process.id || `process-${index}`} className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900">
                            {process.processType === 'divorcio' && 'Proceso de Divorcio'}
                            {process.processType === 'contrato' && 'Redacción de Contrato'}
                            {process.processType === 'laboral' && 'Demanda Laboral'}
                          </p>
                          <p className="text-xs text-neutral-500">
                            Paso {process.currentStep + 1} - {process.status === 'in_progress' ? 'En progreso' : process.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
