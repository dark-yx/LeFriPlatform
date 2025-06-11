import { useParams } from 'wouter';
import { ProcessDetail } from '@/components/process-detail';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Navbar } from '@/components/navbar';

export function ProcessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  
  const { data: user } = useQuery<{ country?: string }>({
    queryKey: ['/api/user'],
  });

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="text-center py-8">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="text-neutral-900">{t('common.error')}</p>
              <Link href="/processes">
                <Button variant="outline" className="mt-4 bg-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('processes.detail.backToProcesses')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/processes">
              <Button variant="outline" size="sm" className="bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-neutral-900">{t('processes.detail.processDetails')}</h1>
          </div>
          
          <ProcessDetail 
            processId={id} 
            country={(user as any)?.country || 'Colombia'} 
          />
        </div>
      </main>
    </div>
  );
}