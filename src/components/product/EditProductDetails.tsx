
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/types/customer";
import { ProductFormFields } from "./form/ProductFormFields";
import { useProductForm } from "./hooks/useProductForm";

interface EditProductDetailsProps {
  product: Product;
}

export const EditProductDetails = ({ product }: EditProductDetailsProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const formState = useProductForm(product);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updateData: any = {
        model: formState.model,
        product_category: formState.category,
        imei: formState.imei,
        sku: formState.sku,
        scheme: formState.scheme,
        purchase_date: formState.purchaseDate,
        purchase_price_including_VAT: formState.purchasePrice,
      };

      if (formState.scheme.includes('buy-back')) {
        updateData[`${formState.scheme}_rate`] = formState.buybackRate;
        updateData[`${formState.scheme}_price`] = formState.buybackPrice;
      }

      const { error } = await supabase
        .from('Products')
        .update(updateData)
        .eq('id', product.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['product', product.id] });
      toast({
        title: "Success",
        description: "Product details updated successfully",
      });
      setOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product details",
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Product Details</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <ProductFormFields {...formState} />
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
