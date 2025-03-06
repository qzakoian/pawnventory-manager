
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Customer } from "@/types/customer";

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

      // Ensure the customer_type is one of the allowed values
      if (data.customer) {
        const customerType = data.customer.customer_type;
        if (customerType === "company" || customerType === "individual") {
          // Explicitly cast customer_type to the union type
          data.customer.customer_type = customerType as "company" | "individual";
        } else {
          data.customer.customer_type = null;
        }
      }
      
      return data;
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
