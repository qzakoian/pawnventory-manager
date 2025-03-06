
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Customer, Product } from "@/types/customer";

export const useCustomerData = (customerId: string | undefined) => {
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
        // Fix: Use customerId parameter instead of undefined 'id' variable
        const customerIdNumber = parseInt(customerId || '');
        if (isNaN(customerIdNumber)) {
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
          .eq('id', customerIdNumber)
          .single();

        if (customerError) throw customerError;
        setCustomer(customerData as Customer);

        const { data: productsData, error: productsError } = await supabase
          .from('Products')
          .select('*')
          .eq('customer_id', customerIdNumber)
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

    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId, toast]);

  return {
    customer,
    setCustomer,
    products,
    setProducts,
    loading,
    categories,
    schemes
  };
};
