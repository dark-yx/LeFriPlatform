import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TranslationProvider } from "@/components/translation-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import Consulta from './pages/Consulta';
import Proceso from './pages/Proceso';
import Emergencia from './pages/Emergencia';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { ProcessesPage } from "@/pages/processes";
import { ProcessDetailPage } from "@/pages/process-detail";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Redirect root to appropriate page */}
      <Route path="/" element={
        token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
      } />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      } />
      
      <Route path="/consulta" element={
        <AuthGuard>
          <Consulta />
        </AuthGuard>
      } />
      
      <Route path="/proceso" element={
        <AuthGuard>
          <Proceso />
        </AuthGuard>
      } />
      
      <Route path="/processes" element={
        <AuthGuard>
          <ProcessesPage />
        </AuthGuard>
      } />
      
      <Route path="/processes/:id" element={
        <AuthGuard>
          <ProcessDetailPage />
        </AuthGuard>
      } />
      
      <Route path="/emergencia" element={
        <AuthGuard>
          <Emergencia />
        </AuthGuard>
      } />
      
      <Route path="/profile" element={
        <AuthGuard>
          <Profile />
        </AuthGuard>
      } />
      
      {/* Fallback to 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider defaultTheme="light" storageKey="replit-legal-theme">
        <QueryClientProvider client={queryClient}>
          <TranslationProvider>
            <TooltipProvider>
              <Toaster />
              <Router>
                <AppRoutes />
              </Router>
            </TooltipProvider>
          </TranslationProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
