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
import { EditContactDialog } from '@/components/edit-contact-dialog';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Phone must have at least 10 digits'),
  relationship: z.string().min(1, 'Relationship is required'),
  whatsappEnabled: z.boolean().default(true),
});

type EmergencyContactForm = z.infer<typeof emergencyContactSchema>;

export default function Emergencia() {
  const [, setLocation] = useLocation();
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
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
    if (confirm('Are you sure you want to delete this contact?')) {
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
    { value: 'mother', label: 'Mother' },
    { value: 'father', label: 'Father' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'partner', label: 'Partner' },
    { value: 'lawyer', label: 'Lawyer' },
    { value: 'friend', label: 'Friend' },
    { value: 'other', label: 'Other' },
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
            <h1 className="text-2xl font-bold text-neutral-900">Emergency System</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Emergency Button */}
            <EmergencyButton />

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Emergency Contacts</CardTitle>
                  <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Emergency Contact</DialogTitle>
                      </DialogHeader>
                      
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            placeholder="Ex: Maria Perez"
                            {...register('name')}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
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
                      <div key={contact._id || contact.id || `contact-${index}`} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
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
                            onClick={() => setEditingContact(contact)}
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
      
      {/* Edit Contact Dialog */}
      <EditContactDialog
        contact={editingContact}
        isOpen={!!editingContact}
        onClose={() => setEditingContact(null)}
      />
    </div>
  );
}
