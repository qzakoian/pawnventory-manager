
import { Plus } from "lucide-react";
import { ImportProductsDialog } from "@/components/product/import/ImportProductsDialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductsHeaderProps {
  shopId: number | undefined;
  onAddProduct: () => void;
}

export const ProductsHeader = ({ shopId, onAddProduct }: ProductsHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4 md:mb-6">
      <h1 className="text-xl md:text-2xl font-semibold text-foreground">Products</h1>
      {shopId && (
        <div className="flex items-center">
          {!isMobile && <ImportProductsDialog shopId={shopId} />}
          {isMobile && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={onAddProduct}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
