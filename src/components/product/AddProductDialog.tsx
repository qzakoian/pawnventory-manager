import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ImageRecognition } from "@/components/customer-profile/add-product/ImageRecognition";
import { NewProduct, ProductInfo } from "@/types/customer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualEntryTab } from "@/components/product/dialog/ManualEntryTab";
import { useAddProductForm } from "@/components/product/hooks/useAddProductForm";
import { mapToAvailableCategory } from "@/components/product/utils/categoryMapping";
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
  schemes
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
    const productToSubmit = {
      ...newProduct,
      [`${newProduct.scheme}_rate`]: buybackRate,
      [`${newProduct.scheme}_price`]: buybackPrice,
      imei,
      sku
    };
    onSubmit(productToSubmit);
    resetForm();
  };
  const handleProductInfoDetected = (productInfo: ProductInfo) => {
    if (productInfo.model) {
      setNewProduct(prev => ({
        ...prev,
        model: productInfo.model
      }));
    }
    if (productInfo.brand) {
      setNewProduct(prev => ({
        ...prev,
        brand: productInfo.brand
      }));
    }
    if (productInfo.category) {
      const mappedCategory = mapToAvailableCategory(productInfo.category, categories);
      if (mappedCategory) {
        setNewProduct(prev => ({
          ...prev,
          product_category: mappedCategory
        }));
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
  return <Sheet open={isOpen} onOpenChange={onOpenChange}>
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
            <ManualEntryTab newProduct={newProduct} setNewProduct={setNewProduct} buybackRate={buybackRate} setBuybackRate={setBuybackRate} buybackPrice={buybackPrice} setBuybackPrice={setBuybackPrice} imei={imei} setImei={setImei} sku={sku} setSku={setSku} brands={brands} categories={categories} schemes={schemes} generateRandomIMEI={generateRandomIMEI} generateRandomSKU={generateRandomSKU} />
          </TabsContent>
          
          <TabsContent value="ai">
            <div className="space-y-4">
              <ImageRecognition onProductInfoDetected={handleProductInfoDetected} />
            </div>
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="mt-6 space-y-2 sm:space-y-0 sm:space-x-2 pb-6 mb-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="mb-2 sm:mb-0">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="my-[6px]">
            Create Product
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>;
};