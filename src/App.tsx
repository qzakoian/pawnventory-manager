
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AccountSettings from "@/pages/AccountSettings";
import CustomerProfile from "@/pages/CustomerProfile";
import ProductDetails from "@/pages/ProductDetails";
import { AuthProvider } from "@/contexts/AuthContext";
import { ShopProvider } from "@/contexts/ShopContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ShopProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <main className="flex-1">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account-settings"
                    element={
                      <ProtectedRoute>
                        <AccountSettings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/customer/:id"
                    element={
                      <ProtectedRoute>
                        <CustomerProfile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/product/:id"
                    element={
                      <ProtectedRoute>
                        <ProductDetails />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <Toaster />
            </div>
          </SidebarProvider>
        </ShopProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
