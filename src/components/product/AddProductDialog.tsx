
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
import { ProductBasicFields } from "@/components/customer-profile/add-product/ProductBasicFields";
import { BuybackFields } from "@/components/customer-profile/add-product/BuybackFields";
import { IdentifierFields } from "@/components/customer-profile/add-product/IdentifierFields";
import { ImageRecognition } from "@/components/customer-profile/add-product/ImageRecognition";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NewProduct } from "@/types/customer";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [brands, setBrands] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("manual");

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase
        .from('Brands')
        .select('name')
        .order('name');
      
      if (data) {
        setBrands(data.map(brand => brand.name || "").filter(Boolean));
      }
    };

    fetchBrands();
  }, []);

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
    setActiveTab("manual");
  };

  const handleProductInfoDetected = (productInfo: any) => {
    if (productInfo.model) {
      setNewProduct(prev => ({ ...prev, model: productInfo.model }));
    }
    
    if (productInfo.brand) {
      setNewProduct(prev => ({ ...prev, brand: productInfo.brand }));
    }
    
    if (productInfo.category) {
      // Map the recognized category to one available in our system
      const mappedCategory = mapToAvailableCategory(productInfo.category, categories);
      if (mappedCategory) {
        setNewProduct(prev => ({ ...prev, product_category: mappedCategory }));
      }
    }
    
    if (productInfo.imei) {
      setImei(productInfo.imei);
    }
    
    if (productInfo.sku) {
      setSku(productInfo.sku);
    }
    
    // Switch to manual tab after AI has filled in the information
    setActiveTab("manual");
  };
  
  const mapToAvailableCategory = (detectedCategory: string, availableCategories: string[]): string => {
    // First, try to match directly
    const directMatch = availableCategories.find(
      c => c.toLowerCase() === detectedCategory.toLowerCase()
    );
    
    if (directMatch) return directMatch;
    
    // If no direct match, try to find partial matches
    const lowerDetected = detectedCategory.toLowerCase();
    
    // Define some common mappings for detected categories
    const categoryMappings: Record<string, string[]> = {
      'smartphone': ['phone', 'mobile', 'cell'],
      'tablet': ['ipad', 'tab'],
      'laptop': ['notebook', 'computer', 'pc'],
      'watch': ['smartwatch', 'wearable'],
    };
    
    // Check if any of our available categories contains the detected term
    for (const category of availableCategories) {
      const lowerCategory = category.toLowerCase();
      
      // Direct partial match
      if (lowerCategory.includes(lowerDetected) || lowerDetected.includes(lowerCategory)) {
        return category;
      }
      
      // Check against mappings
      for (const [key, synonyms] of Object.entries(categoryMappings)) {
        if (synonyms.some(s => lowerDetected.includes(s)) && lowerCategory.includes(key)) {
          return category;
        }
      }
    }
    
    // If all else fails, return the first category if available
    return availableCategories.length > 0 ? availableCategories[0] : "";
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="ai">AI Detection</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <ProductBasicFields
              newProduct={newProduct}
              onProductChange={setNewProduct}
              brands={brands}
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
                purchasePrice={newProduct.purchase_price_including_VAT}
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
          </TabsContent>
          
          <TabsContent value="ai">
            <div className="space-y-4">
              <ImageRecognition onProductInfoDetected={handleProductInfoDetected} />
            </div>
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
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
