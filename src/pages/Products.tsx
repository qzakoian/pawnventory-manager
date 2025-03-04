
import { useShop } from "@/contexts/ShopContext";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ProductSearch } from "@/components/product/ProductSearch";
import { AddProductDialog } from "@/components/product/AddProductDialog";
import { toast } from "@/components/ui/use-toast";
import { NewProduct } from "@/types/customer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductsHeader } from "@/components/product/ProductsHeader";
import { ProductsTable } from "@/components/product/ProductsTable";
import { AddProductButton } from "@/components/product/AddProductButton";

const Products = () => {
  const { selectedShop } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (location.pathname === '/products/new') {
      setIsAddProductOpen(true);
    }
  }, [location]);

  useEffect(() => {
    if (isAddProductOpen) {
      navigate('/products/new', { replace: true });
    } else if (location.pathname === '/products/new') {
      navigate('/products', { replace: true });
    }
  }, [isAddProductOpen, navigate, location.pathname]);

  const { data: products, isLoading, refetch } = useQuery({
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

  const { data: categories } = useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Product Categories')
        .select('name')
        .order('name');
      if (error) throw error;
      return data?.map(category => category.name) || [];
    },
  });

  const { data: schemes } = useQuery({
    queryKey: ['productSchemes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Product Schemes')
        .select('name')
        .order('name');
      if (error) throw error;
      return data?.map(scheme => scheme.name) || [];
    },
  });

  const handleAddProduct = async (product: NewProduct) => {
    try {
      const { error } = await supabase
        .from('Products')
        .insert([{
          ...product,
          shop_id: selectedShop?.id,
          in_stock: true
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product added successfully",
      });
      
      setIsAddProductOpen(false);
      refetch();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-8">
        <div>
          <ProductsHeader 
            shopId={selectedShop?.id} 
            onAddProduct={() => setIsAddProductOpen(true)} 
          />
          
          {selectedShop && <ProductSearch shopId={selectedShop.id} />}
          
          <Card className="mt-4 md:mt-8">
            <ProductsTable products={products} isLoading={isLoading} />
          </Card>
          
          {!isMobile && (
            <AddProductButton onClick={() => setIsAddProductOpen(true)} />
          )}
        </div>
      </main>

      <AddProductDialog
        isOpen={isAddProductOpen}
        onOpenChange={(open) => {
          setIsAddProductOpen(open);
        }}
        onSubmit={handleAddProduct}
        categories={categories || []}
        schemes={schemes || []}
      />
    </div>
  );
};

export default Products;
