
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { AppLayout } from "./components/layout/AppLayout";
import Alerts from "./pages/Alerts";
import AlertDetail from "./pages/AlertDetail";
import CreateAlert from "./pages/CreateAlert";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Monitor from "./pages/Monitor";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";

// Create a new QueryClient instance
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
            {/* Onboarding Route */}
            <Route 
              path="/onboarding" 
              element={
                isOnboarded ? 
                <Navigate to="/alerts" replace /> : 
                <OnboardingPage onComplete={completeOnboarding} />
              } 
            />
            
            {/* Protected App Routes - redirects to onboarding if not completed */}
            <Route 
              element={
                isOnboarded ? 
                <AppLayout /> : 
                <Navigate to="/onboarding" replace />
              }
            >
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/alerts/create" element={<CreateAlert />} />
              <Route path="/alerts/:id" element={<AlertDetail />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/monitor" element={<Monitor />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
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
