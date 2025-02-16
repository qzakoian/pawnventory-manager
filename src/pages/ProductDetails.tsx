
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft, Edit } from "lucide-react";
import { ShopsDropdown } from "@/components/ShopsDropdown";
import { EditProductForm } from "@/components/product/EditProductForm";
import { useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      const productId = parseInt(id);
      if (isNaN(productId)) throw new Error('Invalid product ID');

      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] p-6">
        <div className="max-w-7xl mx-auto">
          Loading...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] p-6">
        <div className="max-w-7xl mx-auto">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <header className="bg-[#646ECB] text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span className="font-medium">Pawn Systems</span>
          </div>
          <div className="flex items-center space-x-4">
            <ShopsDropdown />
          </div>
        </div>
      </header>

      <main className="px-6 py-8 max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <Link to="/">
            <Button
              variant="ghost"
              className="text-[#646ECB] hover:bg-[#646ECB]/10 hover:text-[#646ECB]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-gray-500 text-sm">Product Details</p>
              <h1 className="text-3xl font-semibold text-[#2A2A2A]">
                {product.model}
              </h1>
            </div>
            <Button
              onClick={() => setIsEditDialogOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Product
            </Button>
          </div>
        </div>

        <Card className="p-6">
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

        <EditProductForm 
          product={product}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['product', id] })}
        />
      </main>
    </div>
  );
};

export default ProductDetails;
