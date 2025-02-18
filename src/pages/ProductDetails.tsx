
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { EditProductDetails } from "@/components/product/EditProductDetails";
import { ProductDetailsCard } from "@/components/product/ProductDetailsCard";
import { CustomerDetailsCard } from "@/components/product/CustomerDetailsCard";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const productId = id ? parseInt(id) : null;

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) throw new Error('Product ID is required');
      
      const { data, error } = await supabase
        .from('Products')
        .select('*, customer:Customers(*)')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Customers')
        .select('id, first_name, last_name')
        .order('first_name');
      
      if (error) throw error;
      return data;
    },
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
        description: "Customer updated successfully",
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update customer",
      });
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          Loading...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="px-6 py-8 max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <Link to="/">
            <Button
              variant="ghost"
              className="text-[#646ECB] hover:bg-[#646ECB]/10 hover:text-[#646ECB]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-gray-500 text-sm">Product Details</p>
              <h1 className="text-3xl font-semibold text-[#2A2A2A]">
                {product.model}
              </h1>
            </div>
            <EditProductDetails product={product} />
          </div>
        </div>

        <div className="space-y-6">
          <ProductDetailsCard product={product} />
          
          <CustomerDetailsCard
            customers={customers || []}
            selectedCustomer={product.customer}
            isLoadingCustomers={isLoadingCustomers}
            onCustomerUpdate={updateCustomer}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
