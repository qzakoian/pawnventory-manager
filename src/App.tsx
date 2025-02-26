
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ShopProvider } from "@/contexts/ShopContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";

// Import your pages
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import Customers from "@/pages/Customers";
import AccountSettings from "@/pages/AccountSettings";
import CustomerProfile from "@/pages/CustomerProfile";
import ProductDetails from "@/pages/ProductDetails";
import NotFound from "@/pages/NotFound";

// Create QueryClient instance outside of component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      networkMode: 'offlineFirst'
    },
  },
});

function ProtectedLayout() {
  return (
    <div className="flex w-full">
      <SidebarProvider>
        <ShopProvider>
          <AppSidebar />
          <div className="flex-1">
            <Outlet />
          </div>
        </ShopProvider>
      </SidebarProvider>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Index />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<Products />} />
            <Route path="customers" element={<Customers />} />
            <Route path="account-settings" element={<AccountSettings />} />
            <Route path="customer/:id" element={<CustomerProfile />} />
            <Route path="product/:id" element={<ProductDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
