
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { ShopProvider } from "@/contexts/ShopContext";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { Routes, Route, Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Import your pages
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import Customers from "@/pages/Customers";
import AccountSettings from "@/pages/AccountSettings";
import CustomerProfile from "@/pages/CustomerProfile";
import ProductDetails from "@/pages/ProductDetails";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ShopProvider>
          <div className="flex">
            <AppSidebar />
            <div className="flex-1">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
                  <Route index element={<Index />} />
                  <Route path="products" element={<Products />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="account-settings" element={<AccountSettings />} />
                  <Route path="customer/:id" element={<CustomerProfile />} />
                  <Route path="product/:id" element={<ProductDetails />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
          <Toaster />
        </ShopProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
