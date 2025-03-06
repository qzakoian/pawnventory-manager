
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProductDetailsHeaderProps } from "./types";

export const ProductDetailsHeader = ({ 
  onBackClick, 
  productName 
}: ProductDetailsHeaderProps) => {
  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={onBackClick}
        className="text-[#646ECB] hover:bg-[#646ECB]/10 hover:text-[#646ECB]"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>
      
      <div className="space-y-2">
        <p className="text-gray-500 text-sm">Product Details</p>
        <h1 className="text-3xl font-semibold text-[#454545]">
          {productName || "Unknown Product"}
        </h1>
      </div>
    </div>
  );
};
