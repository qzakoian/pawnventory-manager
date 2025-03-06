
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CustomerInfoCard } from "@/components/customer/CustomerInfoCard";
import { CustomerProducts } from "@/components/customer/CustomerProducts";
import { EditCustomerDialog } from "@/components/customer/EditCustomerDialog";
import { CustomerHeader } from "@/components/customer-profile/CustomerHeader";
import { CustomerStats } from "@/components/customer-profile/CustomerStats";
import { AddProductDialog } from "@/components/customer-profile/AddProductDialog";
import { useCustomerData } from "@/hooks/useCustomerData";
import { useCreateProduct } from "@/components/customer-profile/handlers/CreateProductHandler";
import { useUpdateCustomer } from "@/components/customer-profile/handlers/UpdateCustomerHandler";

const CustomerProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);
  
  // Use our custom hook to fetch customer data
  const {
    customer,
    setCustomer,
    products,
    setProducts,
    loading,
    categories,
    schemes
  } = useCustomerData(id);

  // Use our custom handlers
  const { handleCreateProduct } = useCreateProduct(
    customer, 
    products, 
    setProducts, 
    () => setIsNewProductDialogOpen(false)
  );
  
  const { handleUpdateCustomer } = useUpdateCustomer(customer, setCustomer);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          Loading...
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          Customer not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="px-6 py-8 max-w-7xl mx-auto space-y-8">
        <CustomerHeader 
          firstName={customer.first_name || ''} 
          lastName={customer.last_name || ''} 
        />

        <CustomerStats products={products} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CustomerInfoCard 
              customer={customer} 
              onEditClick={() => setIsEditCustomerDialogOpen(true)} 
            />
          </div>
          
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#2A2A2A]">Products</h2>
                  <Button 
                    onClick={() => setIsNewProductDialogOpen(true)} 
                    className="bg-[#646ECB] hover:bg-[#4E56A6]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                </div>
                <CustomerProducts products={products} />
              </div>
            </div>
          </div>
        </div>

        <AddProductDialog
          isOpen={isNewProductDialogOpen}
          onOpenChange={setIsNewProductDialogOpen}
          onSubmit={handleCreateProduct}
          categories={categories}
          schemes={schemes}
        />

        <EditCustomerDialog
          open={isEditCustomerDialogOpen}
          onOpenChange={setIsEditCustomerDialogOpen}
          customer={customer}
          onSave={handleUpdateCustomer}
        />
      </main>
    </div>
  );
};

export default CustomerProfile;
