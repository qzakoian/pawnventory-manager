
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useState } from "react";
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
