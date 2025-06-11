import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { EmergencyStatus } from '@/types';

export function useEmergency() {
  const [status, setStatus] = useState<EmergencyStatus | null>(null);
  const queryClient = useQueryClient();

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  const activateEmergency = useMutation({
    mutationFn: async () => {
      setStatus({ status: 'sending', contactsNotified: [] });
      
      try {
        const location = await getCurrentLocation();
        
        // Get address from coordinates using reverse geocoding (simplified)
        const address = `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`;
        
        const response = await api.sendEmergencyAlert({
          latitude: location.latitude,
          longitude: location.longitude,
          address,
        });
        
        const result = await response.json();
        setStatus({ ...result, status: 'sent' });
        
        return result;
      } catch (error) {
        setStatus({ status: 'failed', contactsNotified: [] });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-contacts'] });
    },
  });

  const resetStatus = () => setStatus(null);

  return {
    status,
    activateEmergency: activateEmergency.mutate,
    isActivating: activateEmergency.isPending,
    resetStatus,
  };
}
