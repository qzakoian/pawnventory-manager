
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/customer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditProductDetailsProps {
  product: Product;
}

export const EditProductDetails = ({ product }: EditProductDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(product.model || "");
  const [category, setCategory] = useState(product.product_category || "");
  const [imei, setImei] = useState(product.imei || "");
  const [sku, setSku] = useState(product.sku || "");
  const [scheme, setScheme] = useState(product.scheme || "");
  const [purchaseDate, setPurchaseDate] = useState(
    product.purchase_date ? new Date(product.purchase_date).toISOString().split('T')[0] : ""
  );
  const [purchasePrice, setPurchasePrice] = useState(product.purchase_price_including_VAT || 0);
  const [buybackRate, setBuybackRate] = useState<number>(
    product[`${product.scheme}_rate`] || 0
  );
  const [buybackPrice, setBuybackPrice] = useState<number>(
    product[`${product.scheme}_price`] || 0
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    if (purchasePrice && buybackRate) {
      const interest = (purchasePrice * buybackRate) / 100;
      const calculatedPrice = purchasePrice + interest;
      setBuybackPrice(calculatedPrice);
    }
  }, [purchasePrice, buybackRate]);

  useEffect(() => {
    if (purchasePrice && buybackPrice) {
      const difference = buybackPrice - purchasePrice;
      const calculatedRate = (difference / purchasePrice) * 100;
      setBuybackRate(calculatedRate);
    }
  }, [purchasePrice, buybackPrice]);

  const generateRandomIMEI = async () => {
    const { data, error } = await supabase.rpc('generate_random_imei');
    if (!error && data) {
      setImei(data);
    }
  };

  const generateRandomSKU = async () => {
    const { data, error } = await supabase.rpc('generate_random_sku');
    if (!error && data) {
      setSku(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updateData: any = {
        model,
        product_category: category,
        imei,
        sku,
        scheme,
        purchase_date: purchaseDate,
        purchase_price_including_VAT: purchasePrice,
      };

      if (scheme.includes('buy-back')) {
        updateData[`${scheme}_rate`] = buybackRate;
        updateData[`${scheme}_price`] = buybackPrice;
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

  const isBuybackScheme = scheme.includes('buy-back');

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
            <Label htmlFor="scheme">Scheme</Label>
            <Input
              id="scheme"
              value={scheme}
              onChange={(e) => setScheme(e.target.value)}
              placeholder="Enter scheme"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input
              id="purchase_date"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase_price">Purchase Price (inc. VAT)</Label>
            <Input
              id="purchase_price"
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
              placeholder="Enter purchase price"
            />
          </div>

          {isBuybackScheme && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyback_rate">Interest Rate [%]</Label>
                <Input
                  id="buyback_rate"
                  type="number"
                  value={buybackRate}
                  onChange={(e) => setBuybackRate(parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyback_price">Buy-back Price</Label>
                <Input
                  id="buyback_price"
                  type="number"
                  value={buybackPrice}
                  onChange={(e) => setBuybackPrice(parseFloat(e.target.value))}
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imei">IMEI</Label>
              <div className="flex gap-2">
                <Input
                  id="imei"
                  value={imei}
                  onChange={(e) => setImei(e.target.value)}
                  placeholder="Enter IMEI"
                />
                <Button type="button" variant="outline" onClick={generateRandomIMEI} className="shrink-0">
                  Generate
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <div className="flex gap-2">
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Enter SKU"
                />
                <Button type="button" variant="outline" onClick={generateRandomSKU} className="shrink-0">
                  Generate
                </Button>
              </div>
            </div>
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
