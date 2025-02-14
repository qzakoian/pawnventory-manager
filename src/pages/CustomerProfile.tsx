
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Customer {
  id: number;
  first_name: string | null;
  last_name: string | null;
}

interface Product {
  id: number;
  model: string | null;
  product_category: string | null;
  scheme: string | null;
  purchase_date: string | null;
  sale_date: string | null;
  purchase_price_including_VAT: number | null;
  sale_price_including_VAT: number | null;
  in_stock: boolean | null;
}

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const customerId = parseInt(id || '');
        if (isNaN(customerId)) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Invalid customer ID",
          });
          return;
        }

        // Fetch customer details
        const { data: customerData, error: customerError } = await supabase
          .from('Customers')
          .select('*')
          .eq('id', customerId)
          .single();

        if (customerError) throw customerError;
        setCustomer(customerData);

        // Fetch customer's products
        const { data: productsData, error: productsError } = await supabase
          .from('Products')
          .select('*')
          .eq('customer_id', customerId)
          .order('purchase_date', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load customer data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] p-6">
        <div className="max-w-7xl mx-auto">
          Loading...
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#F8F9FF] p-6">
        <div className="max-w-7xl mx-auto">
          Customer not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FF]">
      <header className="bg-[#646ECB] text-white px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span className="font-medium">Pawn Systems</span>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-[#646ECB]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-[#111111]">Customer Profile</h1>
        </div>

        <Card className="p-6 glass-card">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-[#646ECB] p-3 rounded-full text-white">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {customer.first_name} {customer.last_name}
              </h2>
              <p className="text-[#2A2A2A]">Customer ID: {customer.id}</p>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-xl font-bold text-[#111111] mb-4">Customer Products</h2>
          {products.length === 0 ? (
            <Card className="p-6 glass-card text-center">
              <p className="text-[#2A2A2A]">No products found for this customer</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id} className="p-4 glass-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-[#111111]">{product.model}</h3>
                      <p className="text-sm text-[#2A2A2A]">Category: {product.product_category}</p>
                      <p className="text-sm text-[#2A2A2A]">Scheme: {product.scheme}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          Purchase: £{product.purchase_price_including_VAT?.toFixed(2)} 
                          ({new Date(product.purchase_date || '').toLocaleDateString()})
                        </p>
                        {product.sale_date && (
                          <p className="text-sm">
                            Sale: £{product.sale_price_including_VAT?.toFixed(2)}
                            ({new Date(product.sale_date).toLocaleDateString()})
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.in_stock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.in_stock ? 'In Stock' : 'Sold'}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerProfile;
