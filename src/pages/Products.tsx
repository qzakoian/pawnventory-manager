
import { useShop } from "@/contexts/ShopContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { ProductSearch } from "@/components/product/ProductSearch";
import { ImportProductsDialog } from "@/components/product/import/ImportProductsDialog";

const Products = () => {
  const { selectedShop } = useShop();
  const navigate = useNavigate();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', selectedShop?.id],
    queryFn: async () => {
      if (!selectedShop) return [];
      
      const { data, error } = await supabase
        .from('Products')
        .select('*')
        .eq('shop_id', selectedShop.id)
        .order('creation_date', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!selectedShop,
  });

  return (
    <div className="min-h-screen bg-white">
      <main className="p-6 max-w-7xl mx-auto space-y-8">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground">Products</h1>
            {selectedShop && <ImportProductsDialog shopId={selectedShop.id} />}
          </div>
          
          {selectedShop && <ProductSearch shopId={selectedShop.id} />}
          
          <Card className="mt-8">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>IMEI/SKU</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Loading products...
                      </TableCell>
                    </TableRow>
                  ) : products?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    products?.map((product) => (
                      <TableRow 
                        key={product.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <TableCell className="font-medium">
                          {product.model}
                        </TableCell>
                        <TableCell>{product.product_category}</TableCell>
                        <TableCell>
                          {product.imei && (
                            <div className="text-gray-500">{product.imei}</div>
                          )}
                          {product.sku && (
                            <div className="text-gray-500">{product.sku}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {product.purchase_date ? format(new Date(product.purchase_date), "MMM d, yyyy") : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.in_stock 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.in_stock ? 'In Stock' : 'Sold'}
                          </span>
                        </TableCell>
                        <TableCell>
                          £{product.purchase_price_including_VAT?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell>
                          <ArrowRight className="h-4 w-4 text-[#646ECB]" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Products;
