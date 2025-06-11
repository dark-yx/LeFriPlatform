import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useEmergency } from '@/hooks/use-emergency';
import { VoiceRecorder } from '@/components/voice-recorder';
import { AlertTriangle, CheckCircle, MapPin, Mic, Send } from 'lucide-react';

export function EmergencyButton() {
  const { status, activateEmergency, isActivating, resetStatus } = useEmergency();
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [isSendingWithVoice, setIsSendingWithVoice] = useState(false);

  const handleActivateEmergency = () => {
    if (window.confirm('¿Estás seguro de que quieres activar la alerta de emergencia? Se enviará tu ubicación a tus contactos de emergencia.')) {
      activateEmergency();
    }
  };

  const handleVoiceEmergency = () => {
    setShowVoiceModal(true);
  };

  const sendEmergencyWithVoice = async () => {
    if (!voiceBlob) return;

    setIsSendingWithVoice(true);
    
    try {
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude } = position.coords;
      const address = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;

      // Create form data with voice recording
      const formData = new FormData();
      formData.append('voiceNote', voiceBlob, 'emergency_voice.webm');
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());
      formData.append('address', address);

      const response = await fetch('/api/emergency/with-voice', {
        method: 'POST',
        headers: {
          'X-User-Id': '1', // Demo auth
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Emergency API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Update status with result
      resetStatus();
      // Simulate status update (in real app, this would come from the hook)
      setTimeout(() => {
        const emergencyStatus = {
          status: result.status,
          contactsNotified: result.contactsNotified,
          location: result.location
        };
        // This would normally be handled by the emergency hook
      }, 100);

      setShowVoiceModal(false);
      setVoiceBlob(null);
      
    } catch (error) {
      console.error('Emergency with voice error:', error);
      alert('Error al enviar alerta con nota de voz. Intenta nuevamente.');
    } finally {
      setIsSendingWithVoice(false);
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

        <div className="space-y-3">
          <Button
            onClick={handleActivateEmergency}
            disabled={isActivating || isSendingWithVoice}
            className={`w-full py-6 px-8 text-xl font-bold transition-all duration-200 ${
              isActivating || isSendingWithVoice
                ? 'bg-neutral-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600 emergency-pulse'
            }`}
          >
            <AlertTriangle className="w-6 h-6 mr-3" />
            {isActivating ? 'ENVIANDO ALERTAS...' : 'ACTIVAR EMERGENCIA'}
          </Button>

          <Button
            onClick={handleVoiceEmergency}
            disabled={isActivating || isSendingWithVoice}
            variant="outline"
            className={`w-full py-4 px-6 text-lg font-semibold transition-all duration-200 border-2 ${
              isActivating || isSendingWithVoice
                ? 'border-neutral-300 text-neutral-400 cursor-not-allowed'
                : 'border-red-500 text-red-600 hover:bg-red-50'
            }`}
          >
            <Mic className="w-5 h-5 mr-2" />
            EMERGENCIA CON NOTA DE VOZ
          </Button>
        </div>

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

        {/* Voice Recording Modal */}
        <Dialog open={showVoiceModal} onOpenChange={setShowVoiceModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-red-600 flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6" />
                <span>Emergencia con Nota de Voz</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Graba una nota de voz explicando tu situación de emergencia. 
                Esta se enviará junto con tu ubicación a todos tus contactos.
              </p>
              
              <VoiceRecorder
                title="Nota de Voz de Emergencia"
                maxDuration={60}
                onRecordingComplete={setVoiceBlob}
              />
              
              {voiceBlob && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    onClick={() => setShowVoiceModal(false)}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={sendEmergencyWithVoice}
                    disabled={isSendingWithVoice}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSendingWithVoice ? 'Enviando...' : 'Enviar Alerta de Emergencia'}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
