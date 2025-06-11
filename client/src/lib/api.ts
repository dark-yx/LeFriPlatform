import { apiRequest } from './queryClient';

export const api = {
  // Auth
  googleAuth: (data: { email: string; name: string; googleId: string }) =>
    apiRequest('POST', '/api/auth/google', data),
  
  getMe: () => apiRequest('GET', '/api/auth/me'),

  // Consultations
  askQuestion: (data: { query: string; country: string; language: string }) =>
    apiRequest('POST', '/api/ask', data),
  
  getConsultations: () => apiRequest('GET', '/api/consultations'),

  // Emergency
  sendEmergencyAlert: (data: { latitude?: number; longitude?: number; address?: string }) =>
    apiRequest('POST', '/api/emergency', data),
  
  getEmergencyContacts: () => apiRequest('GET', '/api/emergency-contacts'),
  
  createEmergencyContact: (data: { name: string; phone: string; relationship: string; whatsappEnabled: boolean }) =>
    apiRequest('POST', '/api/emergency-contacts', data),
  
  deleteEmergencyContact: (id: number) =>
    apiRequest('DELETE', `/api/emergency-contacts/${id}`),

  // Legal processes
  getProcesses: () => apiRequest('GET', '/api/processes'),
  
  createProcess: (data: { processType: string; currentStep?: number; data?: any }) =>
    apiRequest('POST', '/api/processes', data),
  
  updateProcess: (id: number, data: { currentStep?: number; status?: string; data?: any }) =>
    apiRequest('PUT', `/api/processes/${id}`, data),

  // Profile
  updateProfile: (data: { name?: string; email?: string; phone?: string; language?: string; country?: string }) =>
    apiRequest('PUT', '/api/profile', data),
};
