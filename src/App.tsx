
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Import components for routing
import { AppLayout } from "./components/layout/AppLayout";
import Alerts from "./pages/Alerts";
import AlertDetail from "./pages/AlertDetail";
import CreateAlert from "./pages/CreateAlert";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Monitor from "./pages/Monitor";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import Workspaces from "./pages/Workspaces";
import WorkspaceDetail from "./pages/WorkspaceDetail";
import Reports from "./pages/Reports";
import ReportMigration from "./pages/ReportMigration";
import DataCatalog from "./pages/DataCatalog";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    const storedOnboardingState = localStorage.getItem('isOnboarded');
    return storedOnboardingState === 'true';
  });

  const completeOnboarding = () => {
    setIsOnboarded(true);
    localStorage.setItem('isOnboarded', 'true');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Default Route */}
            <Route 
              path="/" 
              element={
                isOnboarded ? 
                <Navigate to="/alerts" replace /> : 
                <Navigate to="/onboarding" replace />
              } 
            />

            {/* Onboarding Route - Allow direct access */}
            <Route 
              path="/onboarding" 
              element={<OnboardingPage onComplete={completeOnboarding} />}
            />
            
            {/* Protected App Routes - redirects to onboarding if not completed */}
            <Route 
              element={
                isOnboarded ? 
                <AppLayout /> : 
                <Navigate to="/onboarding" replace />
              }
            >
              {/* Alert Routes */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/alerts/create" element={<CreateAlert />} />
              <Route path="/alerts/:id" element={<AlertDetail />} />
              <Route path="/monitor" element={<Monitor />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
              
              {/* Power BI Routes */}
              <Route path="/workspaces" element={<Workspaces />} />
              <Route path="/workspaces/:id" element={<WorkspaceDetail />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/report-migration" element={<ReportMigration />} />
              <Route path="/data-catalog" element={<DataCatalog />} />
              
              {/* Admin Routes */}
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* Handle 404 routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
