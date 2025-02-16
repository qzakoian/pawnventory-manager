
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CreateProductForm } from "./CreateProductForm";

interface Product {
  id: number;
  model: string | null;
  imei: string | null;
  sku: string | null;
}

interface ProductSearchProps {
  shopId: number;
}

export const ProductSearch = ({ shopId }: ProductSearchProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleProductSearch = async (query: string) => {
    if (!query.trim() || !shopId) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('Products')
        .select('id, model, imei, sku')
        .eq('shop_id', shopId)
        .or(`imei.ilike.%${query}%,sku.ilike.%${query}%,model.ilike.%${query}%`)
        .limit(5);

      if (error) throw error;

      setSearchResults(data || []);

      if (data && data.length === 0 && query.trim() !== '') {
        toast({
          description: "No products found",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error searching products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search for products",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="p-4 glass-card">
      <h3 className="text-lg font-medium text-[#111111] mb-4">Find a Product</h3>
      <div className="flex space-x-2">
        <Input 
          placeholder="IMEI/SKU/ID" 
          className="flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button 
          variant="outline" 
          className="text-[#646ECB]"
          onClick={() => handleProductSearch(searchQuery)}
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : (
            <>
              Find <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {searchResults.length > 0 && (
        <div className="mt-2 space-y-1">
          {searchResults.map((product) => (
            <div
              key={product.id}
              className="p-2 hover:bg-gray-50 rounded-md cursor-pointer flex items-center justify-between"
              onClick={() => {
                navigate(`/product/${product.id}`);
              }}
            >
              <span>{product.model} {product.imei && `- ${product.imei}`} {product.sku && `(${product.sku})`}</span>
              <ArrowRight className="h-4 w-4 text-[#646ECB]" />
            </div>
          ))}
        </div>
      )}
      <CreateProductForm shopId={shopId} />
    </Card>
  );
};
