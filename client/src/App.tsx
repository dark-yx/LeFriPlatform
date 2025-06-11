import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { TranslationProvider } from "@/contexts/translations";
import { ThemeProvider } from "@/components/theme-provider";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Consulta from "@/pages/consulta";
import Proceso from "@/pages/proceso";
import Emergencia from "@/pages/emergencia";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { ProcessesPage } from "@/pages/processes";
import { ProcessDetailPage } from "@/pages/process-detail";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  return <>{children}</>;
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      
      {/* Redirect root to appropriate page */}
      <Route path="/">
        {user ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      
      {/* Protected routes */}
      <Route path="/dashboard">
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      </Route>
      
      <Route path="/consulta">
        <AuthGuard>
          <Consulta />
        </AuthGuard>
      </Route>
      
      <Route path="/proceso">
        <AuthGuard>
          <Proceso />
        </AuthGuard>
      </Route>
      
      <Route path="/processes">
        <AuthGuard>
          <ProcessesPage />
        </AuthGuard>
      </Route>
      
      <Route path="/processes/:id">
        <AuthGuard>
          <ProcessDetailPage />
        </AuthGuard>
      </Route>
      
      <Route path="/emergencia">
        <AuthGuard>
          <Emergencia />
        </AuthGuard>
      </Route>
      
      <Route path="/profile">
        <AuthGuard>
          <Profile />
        </AuthGuard>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="replit-legal-theme">
      <QueryClientProvider client={queryClient}>
        <TranslationProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </TranslationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
