
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/customer";

interface EditProductDetailsProps {
  product: Product;
}

export const EditProductDetails = ({ product }: EditProductDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(product.model || "");
  const [category, setCategory] = useState(product.product_category || "");
  const [imei, setImei] = useState(product.imei || "");
  const [sku, setSku] = useState(product.sku || "");
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('Products')
        .update({
          model,
          product_category: category,
          imei,
          sku,
        })
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
      <Button variant="outline" size="icon" onClick={() => setOpen(true)}>
        <Edit className="h-4 w-4" />
      </Button>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Product Details</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Enter model name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imei">IMEI</Label>
            <Input
              id="imei"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              placeholder="Enter IMEI"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Enter SKU"
            />
          </div>

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
