
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProductInfo } from "./utils/productImageUtils";
import { supabase } from "@/integrations/supabase/client";

interface ImagePreviewProps {
  imageSrc: string;
  onReset: () => void;
  onProductInfoDetected: (productInfo: ProductInfo) => void;
}

export const ImagePreview = ({ imageSrc, onReset, onProductInfoDetected }: ImagePreviewProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeImage = async () => {
    setIsAnalyzing(true);
    try {
      // Convert dataURL to base64 string (remove the prefix)
      const base64Image = imageSrc.split(",")[1];

      const { data, error } = await supabase.functions.invoke('analyze-product-image', {
        body: { imageBase64: base64Image },
      });

      if (error) {
        throw error;
      }

      if (data.productInfo) {
        toast({
          title: "Analysis Complete",
          description: "Product information extracted successfully!",
        });
        onProductInfoDetected(data.productInfo);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not extract product information from the image.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <img 
          src={imageSrc} 
          alt="Selected product" 
          className="w-full h-auto rounded-md border border-gray-300"
        />
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
      <div className="flex justify-center mt-2">
        <Button 
          onClick={analyzeImage} 
          disabled={isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Image"
          )}
        </Button>
      </div>
    </div>
  );
};
