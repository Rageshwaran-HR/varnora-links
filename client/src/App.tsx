import { Switch, Route } from "wouter";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import CompanyInfoPage from "./pages/admin/CompanyInfoPage";
import AppearancePage from "./pages/admin/AppearancePage";
import LinksPage from "./pages/admin/LinksPage";
import DashboardPage from "./pages/admin/DashboardPage";
import Layout from "./components/Layout";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/admin" component={DashboardPage} />
      <ProtectedRoute path="/admin/company-info" component={CompanyInfoPage} />
      <ProtectedRoute path="/admin/appearance" component={AppearancePage} />
      <ProtectedRoute path="/admin/links" component={LinksPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Layout>
            <Toaster />
            <Router />
          </Layout>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
