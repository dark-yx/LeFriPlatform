import { useParams } from 'wouter';
import { ProcessDetail } from '@/components/process-detail';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export function ProcessDetailPage() {
  const { id } = useParams<{ id: string }>();
  
  const { data: user } = useQuery<{ country?: string }>({
    queryKey: ['/api/user'],
  });

  if (!id) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
          <p>ID de proceso no válido</p>
          <Link href="/processes">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Procesos
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/processes">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Detalle del Proceso</h1>
      </div>
      
      <ProcessDetail 
        processId={id} 
        country={(user as any)?.country || 'Colombia'} 
      />
    </div>
  );
}