import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import TenantListPage from "@/pages/TenantListPage";
import TenantDetailPage from "@/pages/TenantDetailPage";
import PackageListPage from "@/pages/PackageListPage";
import AddonListPage from "@/pages/AddonListPage";
import BillingOverviewPage from "@/pages/BillingOverviewPage";
import ReportsPage from "@/pages/ReportsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import MonitoringPage from "@/pages/MonitoringPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AuthenticatedRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tenants" element={<TenantListPage />} />
        <Route path="/tenants/:id" element={<TenantDetailPage />} />
        <Route path="/packages" element={<PackageListPage />} />
        <Route path="/addons" element={<AddonListPage />} />
        <Route path="/billing" element={<BillingOverviewPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AuthenticatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
