import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CustomerInfoCard } from "@/components/customer/CustomerInfoCard";
import { CustomerProducts } from "@/components/customer/CustomerProducts";
import { EditCustomerDialog } from "@/components/customer/EditCustomerDialog";
import { Customer, Product, NewProduct, EditCustomer } from "@/types/customer";
import { CustomerHeader } from "@/components/customer-profile/CustomerHeader";
import { CustomerStats } from "@/components/customer-profile/CustomerStats";
import { AddProductDialog } from "@/components/customer-profile/AddProductDialog";
import {
  formatUKPhoneNumber,
  isValidUKPhoneNumber,
  formatPostcode,
  isValidUKPostcode,
} from "@/utils/validation";

const CustomerProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [schemes, setSchemes] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('Product Categories')
        .select('name')
        .order('name');
      
      if (data) {
        setCategories(data.map(cat => cat.name || "").filter(Boolean));
      }
    };

    const fetchSchemes = async () => {
      const { data } = await supabase
        .from('Product Schemes')
        .select('name')
        .order('name');
      
      if (data) {
        setSchemes(data.map(scheme => scheme.name || "").filter(Boolean));
      }
    };

    fetchCategories();
    fetchSchemes();
  }, []);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const customerId = parseInt(id || '');
        if (isNaN(customerId)) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Invalid customer ID",
          });
          return;
        }

        const { data: customerData, error: customerError } = await supabase
          .from('Customers')
          .select('*')
          .eq('id', customerId)
          .single();

        if (customerError) throw customerError;
        setCustomer(customerData);

        const { data: productsData, error: productsError } = await supabase
          .from('Products')
          .select('*')
          .eq('customer_id', customerId)
          .order('purchase_date', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load customer data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id, toast]);

  const handleCreateProduct = async (newProduct: NewProduct) => {
    if (!customer) return;

    try {
      const { data, error } = await supabase
        .from('Products')
        .insert([
          {
            ...newProduct,
            customer_id: customer.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setProducts([data, ...products]);
      setIsNewProductDialogOpen(false);

      toast({
        title: "Success",
        description: "Product created successfully",
      });
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product",
      });
    }
  };

  const handleUpdateCustomer = async (editedCustomer: EditCustomer) => {
    if (!customer) return;

    if (editedCustomer.phone_number && !isValidUKPhoneNumber(editedCustomer.phone_number)) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid UK mobile number",
      });
      return;
    }

    if (editedCustomer.postal_code && !isValidUKPostcode(editedCustomer.postal_code)) {
      toast({
        variant: "destructive",
        title: "Invalid postcode",
        description: "Please enter a valid UK postcode",
      });
      return;
    }

    const formattedPhoneNumber = editedCustomer.phone_number 
      ? formatUKPhoneNumber(editedCustomer.phone_number)
      : '';
    const formattedPostcode = editedCustomer.postal_code 
      ? formatPostcode(editedCustomer.postal_code)
      : '';

    try {
      const updatePayload = {
        first_name: editedCustomer.first_name,
        last_name: editedCustomer.last_name,
        phone_number: formattedPhoneNumber,
        email: editedCustomer.email,
        address_line1: editedCustomer.address_line1,
        address_line2: editedCustomer.address_line2,
        city: editedCustomer.city,
        postal_code: formattedPostcode,
        county: editedCustomer.county,
      };

      const { data, error } = await supabase
        .from('Customers')
        .update(updatePayload)
        .eq('id', customer.id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const updatedCustomer = data[0];
        setCustomer({
          ...customer,
          ...updatedCustomer
        });
        
        setIsEditCustomerDialogOpen(false);
        toast({
          title: "Success",
          description: "Customer profile updated successfully",
        });
      } else {
        throw new Error('No data returned from update operation');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update customer profile",
      });
    }
  };

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
