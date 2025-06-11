import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEmergency } from '@/hooks/use-emergency';
import { AlertTriangle, CheckCircle, MapPin, Clock } from 'lucide-react';

export function EmergencyButton() {
  const { status, activateEmergency, isActivating, resetStatus } = useEmergency();

  const handleActivateEmergency = () => {
    if (window.confirm('¿Estás seguro de que quieres activar la alerta de emergencia? Se enviará tu ubicación a tus contactos de emergencia.')) {
      activateEmergency();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Activar Emergencia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-neutral-600">
          En caso de emergencia, presiona el botón para enviar alertas automáticas a tus contactos 
          de emergencia con tu ubicación actual.
        </p>

        <Button
          onClick={handleActivateEmergency}
          disabled={isActivating}
          className={`w-full py-6 px-8 text-xl font-bold transition-all duration-200 ${
            isActivating 
              ? 'bg-neutral-400 cursor-not-allowed' 
              : 'bg-red-500 hover:bg-red-600 emergency-pulse'
          }`}
        >
          <AlertTriangle className="w-6 h-6 mr-3" />
          {isActivating ? 'ENVIANDO ALERTAS...' : 'ACTIVAR EMERGENCIA'}
        </Button>

        {status && (
          <Alert className={`${
            status.status === 'sent' ? 'border-green-200 bg-green-50' : 
            status.status === 'failed' ? 'border-red-200 bg-red-50' : 
            'border-yellow-200 bg-yellow-50'
          }`}>
            <AlertDescription>
              {status.status === 'sending' && (
                <div className="flex items-center space-x-2">
                  <div className="loader"></div>
                  <span className="text-sm font-medium text-yellow-700">
                    Enviando alertas de emergencia...
                  </span>
                </div>
              )}
              
              {status.status === 'sent' && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Alertas enviadas exitosamente
                    </span>
                  </div>
                  
                  {status.location && (
                    <div className="flex items-center space-x-2 text-sm text-green-600">
                      <MapPin className="w-4 h-4" />
                      <span>Ubicación obtenida: {status.location.address || 'Coordenadas enviadas'}</span>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {status.contactsNotified.map((contact) => (
                      <div key={contact.id} className="flex items-center space-x-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Alerta enviada a {contact.name} vía WhatsApp</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={resetStatus}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    Cerrar
                  </Button>
                </div>
              )}
              
              {status.status === 'failed' && (
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-700">
                    Error al enviar alertas. Intenta nuevamente.
                  </span>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
