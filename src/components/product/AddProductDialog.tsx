
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ProductBasicFields } from "@/components/customer-profile/add-product/ProductBasicFields";
import { BuybackFields } from "@/components/customer-profile/add-product/BuybackFields";
import { IdentifierFields } from "@/components/customer-profile/add-product/IdentifierFields";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NewProduct } from "@/types/customer";
import { supabase } from "@/integrations/supabase/client";

interface AddProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: NewProduct) => void;
  categories: string[];
  schemes: string[];
}

export const AddProductDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  categories,
  schemes,
}: AddProductDialogProps) => {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    model: "",
    brand: "",
    product_category: "",
    scheme: "sale",
    purchase_price_including_VAT: 0,
    purchase_date: new Date().toISOString().split('T')[0],
  });

  const [buybackRate, setBuybackRate] = useState<number>(0);
  const [buybackPrice, setBuybackPrice] = useState<number>(0);
  const [imei, setImei] = useState<string>("");
  const [sku, setSku] = useState<string>("");

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

  const handleSubmit = () => {
    const productToSubmit = {
      ...newProduct,
      [`${newProduct.scheme}_rate`]: buybackRate,
      [`${newProduct.scheme}_price`]: buybackPrice,
      imei,
      sku,
    };
    onSubmit(productToSubmit);
    setNewProduct({
      model: "",
      brand: "",
      product_category: "",
      scheme: "sale",
      purchase_price_including_VAT: 0,
      purchase_date: new Date().toISOString().split('T')[0],
    });
    setBuybackRate(0);
    setBuybackPrice(0);
    setImei("");
    setSku("");
  };

  const isBuybackScheme = newProduct.scheme.includes('buy-back');

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Add New Product</SheetTitle>
          <SheetDescription>
            Create a new product
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4">
          <ProductBasicFields
            newProduct={newProduct}
            onProductChange={setNewProduct}
            brands={[]}
            categories={categories}
            schemes={schemes}
          />
          <div className="space-y-2">
            <Label htmlFor="purchase_price">Purchase Price (inc. VAT)</Label>
            <Input
              id="purchase_price"
              type="number"
              value={newProduct.purchase_price_including_VAT}
              onChange={(e) => setNewProduct({ ...newProduct, purchase_price_including_VAT: parseFloat(e.target.value) })}
            />
          </div>
          {isBuybackScheme && (
            <BuybackFields
              buybackRate={buybackRate}
              buybackPrice={buybackPrice}
              onBuybackRateChange={setBuybackRate}
              onBuybackPriceChange={setBuybackPrice}
            />
          )}
          <IdentifierFields
            imei={imei}
            sku={sku}
            onImeiChange={setImei}
            onSkuChange={setSku}
            onGenerateImei={generateRandomIMEI}
            onGenerateSku={generateRandomSKU}
          />
          <div className="space-y-2">
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input
              id="purchase_date"
              type="date"
              value={newProduct.purchase_date}
              onChange={(e) => setNewProduct({ ...newProduct, purchase_date: e.target.value })}
            />
          </div>
        </div>
        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Product
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
