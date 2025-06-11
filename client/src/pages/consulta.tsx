import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/navbar';
import { ChatInterface } from '@/components/chat-interface';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';

export default function Consulta() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState(user?.country || 'EC');

  const countries = [
    { value: 'EC', label: '🇪🇨 Ecuador' },
    { value: 'CO', label: '🇨🇴 Colombia' },
    { value: 'PE', label: '🇵🇪 Perú' },
    { value: 'US', label: '🇺🇸 Estados Unidos' },
    { value: 'MX', label: '🇲🇽 México' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation('/dashboard')}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </Button>
              <h1 className="text-2xl font-bold text-neutral-900">Consulta Legal</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-neutral-700">País:</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-[180px] bg-white border-neutral-300">
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
          </div>

          {/* Chat Interface */}
          <ChatInterface country={selectedCountry} />
        </div>
      </main>
    </div>
  );
}
