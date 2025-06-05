
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
import EditAlert from "./pages/EditAlert";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import History from "./pages/History";
import DataCatalog from "./pages/DataCatalog";
import DataCatalogManage from "./pages/DataCatalog/DataCatalogManage";
import DataCatalogView from "./pages/DataCatalog/DataCatalogView";
import NotFound from "./pages/NotFound";
import AdminConsole from "./pages/AdminConsole/AdminConsole";
import ClientOnboarding from "./pages/AdminConsole/ClientOnboarding";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const storedLoginState = localStorage.getItem('isLoggedIn');
    return storedLoginState === 'true';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const storedAdminLoginState = localStorage.getItem('isAdminLoggedIn');
    return storedAdminLoginState === 'true';
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('isAdminLoggedIn', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('isAdminLoggedIn');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Login Routes */}
            <Route 
              path="/login" 
              element={
                isLoggedIn ? 
                <Navigate to="/alerts" replace /> : 
                <Login onLogin={handleLogin} />
              }
            />
            
            {/* Admin Login Route */}
            <Route 
              path="/admin-login" 
              element={
                isAdminLoggedIn ? 
                <Navigate to="/admin-console" replace /> : 
                <AdminLogin onAdminLogin={handleAdminLogin} />
              }
            />

            {/* Admin Console Routes */}
            <Route 
              path="/admin-console" 
              element={
                isAdminLoggedIn ? 
                <AdminConsole onLogout={handleAdminLogout} /> : 
                <Navigate to="/admin-login" replace />
              }
            />
            <Route 
              path="/admin-console/client-onboarding/new" 
              element={
                isAdminLoggedIn ? 
                <ClientOnboarding onLogout={handleAdminLogout} /> : 
                <Navigate to="/admin-login" replace />
              }
            />
            <Route 
              path="/admin-console/client-onboarding/edit/:clientId" 
              element={
                isAdminLoggedIn ? 
                <ClientOnboarding onLogout={handleAdminLogout} /> : 
                <Navigate to="/admin-login" replace />
              }
            />

            {/* Default Route */}
            <Route 
              path="/" 
              element={
                isLoggedIn ? 
                <Navigate to="/alerts" replace /> : 
                <Navigate to="/login" replace />
              } 
            />
            
            {/* Protected App Routes - redirects to login if not authenticated */}
            <Route 
              element={
                isLoggedIn ? 
                <AppLayout onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              }
            >
              {/* Alert Routes */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/alerts/create" element={<CreateAlert />} />
              <Route path="/alerts/edit/:id" element={<EditAlert />} />
              <Route path="/alerts/:id" element={<AlertDetail />} />
              <Route path="/history" element={<History />} />
              
              {/* Data Catalog Routes */}
              <Route path="/data-catalog" element={<DataCatalog />} />
              <Route path="/data-catalog/manage" element={<DataCatalogManage />} />
              <Route path="/data-catalog/view/:tableId" element={<DataCatalogView />} />
              
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
