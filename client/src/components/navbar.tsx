
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/components/theme-provider';
import { Scale, ChevronDown, User, Settings, LogOut, Moon, Sun, Globe } from 'lucide-react';
import { changeLanguage } from '../i18n';

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { user, logout, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (newLanguage: string) => {
    changeLanguage(newLanguage);
    updateUser({ language: newLanguage });
  };

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const languageOptions = [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'es', label: '🇪🇸 Español' },
  ];

  return (
    <header className="navbar">
      <div className="w-full flex items-center justify-between px-6">
        {/* Logo - Pegado a la izquierda */}
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <h1 className="navbar-logo">LeFriAI</h1>
        </Link>

        {/* Right section - Pegado a la derecha */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px] bg-white border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-lg">
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="hover:bg-gray-100">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {user?.name || t('auth.login')}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-300 shadow-lg">
              <DropdownMenuItem onClick={() => setLocation('/profile')} className="hover:bg-gray-100">
                <User className="w-4 h-4 mr-2" />
                {t('navbar.profile')}
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-100">
                <Settings className="w-4 h-4 mr-2" />
                {t('navbar.settings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                {t('auth.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
