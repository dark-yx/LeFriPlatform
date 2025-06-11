import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus, Edit, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navbar } from '@/components/navbar';
import { EmergencyButton } from '@/components/emergency-button';
import { api } from '@/lib/api';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  relationship: z.string().min(1, 'La relación es requerida'),
  whatsappEnabled: z.boolean().default(true),
});

type EmergencyContactForm = z.infer<typeof emergencyContactSchema>;

export default function Emergencia() {
  const [, setLocation] = useLocation();
  const [isAddingContact, setIsAddingContact] = useState(false);
  const queryClient = useQueryClient();

  const { data: emergencyContacts } = useQuery({
    queryKey: ['/api/emergency-contacts'],
    queryFn: async () => {
      const response = await api.getEmergencyContacts();
      return await response.json();
    },
  });

  const addContactMutation = useMutation({
    mutationFn: api.createEmergencyContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-contacts'] });
      setIsAddingContact(false);
      reset();
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: api.deleteEmergencyContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-contacts'] });
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EmergencyContactForm>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      whatsappEnabled: true,
    },
  });

  const onSubmit = async (data: EmergencyContactForm) => {
    try {
      await addContactMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDeleteContact = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      deleteContactMutation.mutate(id);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
    return colors[index % colors.length];
  };

  const relationships = [
    { value: 'madre', label: 'Madre' },
    { value: 'padre', label: 'Padre' },
    { value: 'hermano', label: 'Hermano/a' },
    { value: 'pareja', label: 'Pareja' },
    { value: 'abogado', label: 'Abogado' },
    { value: 'amigo', label: 'Amigo/a' },
    { value: 'otro', label: 'Otro' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setLocation('/dashboard')}
              className="p-2 hover:bg-neutral-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </Button>
            <h1 className="text-2xl font-bold text-neutral-900">Sistema de Emergencia</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emergency Button */}
            <EmergencyButton />

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Contactos de Emergencia</CardTitle>
                  <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar Contacto de Emergencia</DialogTitle>
                      </DialogHeader>
                      
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nombre Completo</Label>
                          <Input
                            id="name"
                            placeholder="Ej: María Pérez"
                            {...register('name')}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Número de Teléfono</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+593 99 123 4567"
                            {...register('phone')}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="relationship">Relación</Label>
                          <Select onValueChange={(value) => setValue('relationship', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar relación" />
                            </SelectTrigger>
                            <SelectContent>
                              {relationships.map((rel) => (
                                <SelectItem key={rel.value} value={rel.value}>
                                  {rel.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.relationship && (
                            <p className="text-red-500 text-sm mt-1">{errors.relationship.message}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="whatsapp"
                            checked={watch('whatsappEnabled')}
                            onCheckedChange={(checked) => setValue('whatsappEnabled', checked)}
                          />
                          <Label htmlFor="whatsapp" className="text-sm">
                            Tiene WhatsApp
                          </Label>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setIsAddingContact(false)}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-blue-500 hover:bg-blue-600"
                            disabled={addContactMutation.isPending}
                          >
                            {addContactMutation.isPending ? 'Guardando...' : 'Guardar Contacto'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {emergencyContacts?.length > 0 ? (
                    emergencyContacts.map((contact: any, index: number) => (
                      <div key={contact.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className={`${getAvatarColor(index)} text-white text-xs font-medium`}>
                              {getInitials(contact.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-neutral-900">{contact.name}</p>
                            <p className="text-xs text-neutral-500">
                              {relationships.find(r => r.value === contact.relationship)?.label || contact.relationship} • {contact.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {contact.whatsappEnabled && (
                            <MessageSquare className="w-4 h-4 text-green-500" />
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-neutral-400 hover:text-neutral-600 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-600 p-1"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tienes contactos de emergencia</p>
                      <Button 
                        variant="link" 
                        className="text-blue-500 mt-2"
                        onClick={() => setIsAddingContact(true)}
                      >
                        Agregar primer contacto
                      </Button>
                    </div>
                  )}
                </div>
                
                {emergencyContacts?.length > 0 && (
                  <Alert className="mt-4 border-orange-200 bg-orange-50">
                    <MessageSquare className="w-4 h-4 text-orange-600" />
                    <AlertDescription className="text-orange-700">
                      Los contactos con WhatsApp recibirán alertas instantáneas con tu ubicación.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
