
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewProduct } from "@/types/customer";
import { useShop } from "@/contexts/ShopContext";
import { supabase } from "@/integrations/supabase/client";

interface AddProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: NewProduct) => void;
  customerName: string;
  categories: string[];
  schemes: string[];
}

export const AddProductDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  customerName,
  categories,
  schemes,
}: AddProductDialogProps) => {
  const { selectedShop } = useShop();
  const [brands, setBrands] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    model: "",
    brand: "",
    product_category: "",
    scheme: "buy-back",
    purchase_price_including_VAT: 0,
    purchase_date: new Date().toISOString().split('T')[0],
  });

  const [buybackRate, setBuybackRate] = useState<number>(0);
  const [buybackPrice, setBuybackPrice] = useState<number>(0);
  const [imei, setImei] = useState<string>("");
  const [sku, setSku] = useState<string>("");

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase
        .from('Brands')
        .select('name')
        .order('name');
      
      if (data) {
        setBrands(data.map(brand => brand.name));
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    if (newProduct.purchase_price_including_VAT && buybackRate) {
      const interest = (newProduct.purchase_price_including_VAT * buybackRate) / 100;
      const calculatedPrice = newProduct.purchase_price_including_VAT + interest;
      setBuybackPrice(calculatedPrice);
    }
  }, [newProduct.purchase_price_including_VAT, buybackRate]);

  useEffect(() => {
    if (newProduct.purchase_price_including_VAT && buybackPrice) {
      const difference = buybackPrice - newProduct.purchase_price_including_VAT;
      const calculatedRate = (difference / newProduct.purchase_price_including_VAT) * 100;
      setBuybackRate(calculatedRate);
    }
  }, [newProduct.purchase_price_including_VAT, buybackPrice]);

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
      shop_id: selectedShop?.id,
      imei,
      sku,
    };
    onSubmit(productToSubmit);
    setNewProduct({
      model: "",
      brand: "",
      product_category: "",
      scheme: "buy-back",
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
            Create a new product for {customerName}
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={newProduct.model}
              onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select
              value={newProduct.brand}
              onValueChange={(value) => setNewProduct({ ...newProduct, brand: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Brands</SelectLabel>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newProduct.product_category}
              onValueChange={(value) => setNewProduct({ ...newProduct, product_category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scheme">Scheme</Label>
            <Select
              value={newProduct.scheme}
              onValueChange={(value) => setNewProduct({ ...newProduct, scheme: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Schemes</SelectLabel>
                  {schemes.map((scheme) => (
                    <SelectItem key={scheme} value={scheme}>
                      {scheme}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
