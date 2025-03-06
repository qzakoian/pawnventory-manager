
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Customer, Product } from "@/types/customer";

// Helper function to ensure customer type is properly cast
const processCustomerData = (customer: any): Customer => {
  if (!customer) return null;
  
  // Create a properly typed customer object
  const processedCustomer: Customer = {
    ...customer,
    // Ensure customer_type is one of the valid union types or null
    customer_type: (customer.customer_type === "company" || customer.customer_type === "individual") 
      ? customer.customer_type as "company" | "individual" 
      : null
  };
  
  return processedCustomer;
};

export const useProductData = (productId: number | null) => {
  const queryClient = useQueryClient();

  const { 
    data: product, 
    isLoading: isLoadingProduct 
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');
      const { data, error } = await supabase
        .from('Products')
        .select('*, customer:Customers(*)')
        .eq('id', productId)
        .single();
      if (error) throw error;

      // Process the customer data to ensure it matches our type
      if (data) {
        // Process customer data if it exists
        if (data.customer) {
          data.customer = processCustomerData(data.customer);
        }
        
        // Return the processed data as a Product
        return data as Product;
      }
      
      return null;
    },
    enabled: !!productId
  });

  const { 
    data: customers, 
    isLoading: isLoadingCustomers 
  } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Customers')
        .select('id, first_name, last_name')
        .order('first_name');
      if (error) throw error;
      return data;
    }
  });

  const updateCustomer = async (customerId: number | null) => {
    if (!productId) return;
    try {
      const { error } = await supabase
        .from('Products')
        .update({ customer_id: customerId })
        .eq('id', productId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      toast({
        title: "Success",
        description: "Customer updated successfully"
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update customer"
      });
    }
  };

  return {
    product,
    customers,
    isLoadingProduct,
    isLoadingCustomers,
    updateCustomer
  };
};
