
import { supabase } from "@/integrations/supabase/client";
import { NewProduct, Product } from "@/types/customer";
import { useToast } from "@/components/ui/use-toast";

export const useCreateProduct = (
  customer: { id: number } | null,
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  onSuccess: () => void
) => {
  const { toast } = useToast();

  const handleCreateProduct = async (newProduct: NewProduct) => {
    if (!customer) return;

    try {
      // Prepare the base product data
      let productData: any = {
        model: newProduct.model,
        brand: newProduct.brand,
        product_category: newProduct.product_category,
        scheme: newProduct.scheme,
        purchase_price_including_VAT: newProduct.purchase_price_including_VAT,
        purchase_date: newProduct.purchase_date,
        customer_id: customer.id,
      };

      // Add imei and sku if they exist in the newProduct object
      if ('imei' in newProduct) {
        productData.imei = newProduct.imei;
      }
      
      if ('sku' in newProduct) {
        productData.sku = newProduct.sku;
      }

      // Add scheme-specific data based on the scheme type
      if (newProduct.scheme.includes('buy-back') && newProduct.scheme_rate && newProduct.scheme_price) {
        // For buy-back schemes, add the scheme-specific rate and price columns
        productData[`${newProduct.scheme}_rate`] = newProduct.scheme_rate;
        productData[`${newProduct.scheme}_price`] = newProduct.scheme_price;
      }
      
      // For Free-stock, we don't need to add any special fields
      // The scheme column will already be set to 'Free-stock'

      const { data, error } = await supabase
        .from('Products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      setProducts([data, ...products]);
      onSuccess();

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

  return { handleCreateProduct };
};
