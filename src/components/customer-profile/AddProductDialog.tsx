
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NewProduct, ProductInfo } from "@/types/customer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAddProductForm } from "@/components/customer-profile/hooks/useAddProductForm";
import { ManualEntryTab } from "@/components/customer-profile/add-product/ManualEntryTab";
import { AIDetectionTab } from "@/components/customer-profile/add-product/AIDetectionTab";
import { mapToAvailableCategory } from "@/components/customer-profile/utils/categoryMapping";
import { toast } from "@/hooks/use-toast";

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
  const {
    newProduct,
    setNewProduct,
    buybackRate,
    setBuybackRate,
    buybackPrice,
    setBuybackPrice,
    imei,
    setImei,
    sku,
    setSku,
    brands,
    activeTab,
    setActiveTab,
    generateRandomIMEI,
    generateRandomSKU,
    resetForm
  } = useAddProductForm();

  const handleSubmit = () => {
    // Validate required fields
    if (!newProduct.model.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter a model name",
      });
      return;
    }

    if (!newProduct.brand) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a brand",
      });
      return;
    }

    if (!newProduct.product_category) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a product category",
      });
      return;
    }

    // Create a product object with the necessary fields
    const productToSubmit: NewProduct = {
      ...newProduct,
      imei,
      sku,
    };
    
    // Only add buyback fields if using a buyback scheme
    if (newProduct.scheme.includes('buy-back')) {
      productToSubmit.scheme_rate = buybackRate;
      productToSubmit.scheme_price = buybackPrice;
    }
    
    onSubmit(productToSubmit);
    resetForm();
  };

  const handleProductInfoDetected = (productInfo: ProductInfo) => {
    if (productInfo.model) {
      setNewProduct(prev => ({ ...prev, model: productInfo.model }));
    }
    
    if (productInfo.brand) {
      setNewProduct(prev => ({ ...prev, brand: productInfo.brand }));
    }
    
    if (productInfo.category) {
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
    
    setActiveTab("manual");
  };

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
            <ManualEntryTab
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              buybackRate={buybackRate}
              setBuybackRate={setBuybackRate}
              buybackPrice={buybackPrice}
              setBuybackPrice={setBuybackPrice}
              imei={imei}
              setImei={setImei}
              sku={sku}
              setSku={setSku}
              brands={brands}
              categories={categories}
              schemes={schemes}
              generateRandomIMEI={generateRandomIMEI}
              generateRandomSKU={generateRandomSKU}
            />
          </TabsContent>
          
          <TabsContent value="ai">
            <AIDetectionTab onProductInfoDetected={handleProductInfoDetected} />
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="mt-6 space-y-2 sm:space-y-0 sm:space-x-2 pb-6 mb-4">
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
