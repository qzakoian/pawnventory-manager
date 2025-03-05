
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface ProductInfo {
  model?: string | null;
  brand?: string | null;
  category?: string | null;
  imei?: string | null;
  sku?: string | null;
}

export async function analyzeProductImage(imageBase64: string) {
  const { toast } = useToast();
  
  try {
    // Convert dataURL to base64 string (remove the prefix)
    const base64Image = imageBase64.split(",")[1];

    const { data, error } = await supabase.functions.invoke('analyze-product-image', {
      body: { imageBase64: base64Image },
    });

    if (error) {
      throw error;
    }

    if (data.productInfo) {
      return { success: true, productInfo: data.productInfo };
    } else if (data.error) {
      throw new Error(data.error);
    }
    
    return { success: false, error: "No product information found" };
  } catch (error) {
    console.error("Error analyzing image:", error);
    return { success: false, error: "Failed to analyze image" };
  }
}
