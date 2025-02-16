
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!product) {
    return <div className="p-6">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF] p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">{product.model}</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-500">Category</h3>
                <p className="font-medium">{product.product_category}</p>
              </div>
              
              {product.imei && (
                <div>
                  <h3 className="text-sm text-gray-500">IMEI</h3>
                  <p className="font-medium">{product.imei}</p>
                </div>
              )}
              
              {product.sku && (
                <div>
                  <h3 className="text-sm text-gray-500">SKU</h3>
                  <p className="font-medium">{product.sku}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-500">Purchase Date</h3>
                <p className="font-medium">
                  {product.purchase_date ? new Date(product.purchase_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500">Purchase Price (inc. VAT)</h3>
                <p className="font-medium">£{product.purchase_price_including_VAT?.toFixed(2) || '0.00'}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500">Status</h3>
                <p className="font-medium">{product.in_stock ? 'In Stock' : 'Not in Stock'}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;
