import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, User, Settings, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Navbar } from '@/components/navbar';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  language: z.string(),
  country: z.string(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: consultations } = useQuery({
    queryKey: ['/api/consultations'],
    queryFn: async () => {
      const response = await api.getConsultations();
      return await response.json();
    },
  });

  const { data: processes } = useQuery({
    queryKey: ['/api/processes'],
    queryFn: async () => {
      const response = await api.getProcesses();
      return await response.json();
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: async (response) => {
      const updatedUser = await response.json();
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      language: user?.language || 'en',
      country: user?.country || 'EC',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      await updateProfileMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const countries = [
    { value: 'EC', label: '🇪🇨 Ecuador' },
    { value: 'CO', label: '🇨🇴 Colombia' },
    { value: 'PE', label: '🇵🇪 Perú' },
    { value: 'US', label: '🇺🇸 Estados Unidos' },
    { value: 'MX', label: '🇲🇽 México' },
  ];

  const languages = [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'es', label: '🇪🇸 Español' },
  ];

  // Calculate total usage time (mock)
  const totalHours = consultations?.length ? consultations.length * 2.5 : 0;

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
            <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...register('phone')}
                          placeholder="+1234567890"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select 
                          value={watch('country')} 
                          onValueChange={(value) => setValue('country', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country.value} value={country.value}>
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="language">Preferred Language</Label>
                        <Select 
                          value={watch('language')} 
                          onValueChange={(value) => setValue('language', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((language) => (
                              <SelectItem key={language.value} value={language.value}>
                                {language.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-600"
                        disabled={!isDirty || updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Stats and Settings */}
            <div className="space-y-6">
              {/* Usage Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Usage Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Consultations completed</span>
                    <span className="text-lg font-bold text-blue-500">
                      {consultations?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Processes started</span>
                    <span className="text-lg font-bold text-orange-600">
                      {processes?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Total time</span>
                    <span className="text-lg font-bold text-neutral-900">
                      {totalHours.toFixed(1)}h
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Account Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="text-sm">
                      Email notifications
                    </Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="whatsapp-alerts" className="text-sm">
                      WhatsApp alerts
                    </Label>
                    <Switch id="whatsapp-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode" className="text-sm">
                      Dark mode
                    </Label>
                    <Switch id="dark-mode" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
