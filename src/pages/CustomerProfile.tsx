
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, User, ArrowLeft, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useShop } from "@/contexts/ShopContext";

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

interface NewProduct {
  model: string;
  product_category: string;
  scheme: string;
  purchase_price_including_VAT: number;
  purchase_date: string;
}

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedShop } = useShop();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    model: "",
    product_category: "",
    scheme: "buy-back",
    purchase_price_including_VAT: 0,
    purchase_date: new Date().toISOString().split('T')[0],
  });
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('Product Categories')
        .select('name')
        .order('name');
      
      if (data) {
        setCategories(data.map(cat => cat.name || "").filter(Boolean));
      }
    };

    fetchCategories();
  }, []);

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

  const handleCreateProduct = async () => {
    if (!selectedShop || !customer) return;

    try {
      const { data, error } = await supabase
        .from('Products')
        .insert([
          {
            ...newProduct,
            customer_id: customer.id,
            shop_id: selectedShop.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setProducts([data, ...products]);
      setIsNewProductDialogOpen(false);
      setNewProduct({
        model: "",
        product_category: "",
        scheme: "buy-back",
        purchase_price_including_VAT: 0,
        purchase_date: new Date().toISOString().split('T')[0],
      });

      toast({
        title: "Success",
        description: "Product created successfully",
      });
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product",
      });
    }
  };

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
        <div className="flex items-center justify-between">
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
          <Button onClick={() => setIsNewProductDialogOpen(true)} className="bg-[#646ECB] hover:bg-[#4E56A6]">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        <Card className="p-6 bg-white shadow-sm border-0">
          <div className="flex items-center space-x-4">
            <div className="bg-[#646ECB] p-3 rounded-full text-white">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {customer.first_name} {customer.last_name}
              </h2>
              <p className="text-[#2A2A2A]/70">Customer ID: {customer.id}</p>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-xl font-bold text-[#111111] mb-4">Customer Products</h2>
          {products.length === 0 ? (
            <Card className="p-6 bg-white shadow-sm border-0 text-center">
              <p className="text-[#2A2A2A]/70">No products found for this customer</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {products.map((product) => (
                <Card key={product.id} className="p-4 bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-[#111111]">{product.model}</h3>
                      <div className="space-y-1">
                        <p className="text-sm text-[#2A2A2A]/70">Category: {product.product_category}</p>
                        <p className="text-sm text-[#2A2A2A]/70">Scheme: {product.scheme}</p>
                      </div>
                      <div className="space-y-1 mt-3">
                        <p className="text-sm">
                          Purchase: £{product.purchase_price_including_VAT?.toFixed(2)} 
                          <span className="text-[#2A2A2A]/50 ml-2">
                            ({product.purchase_date ? format(new Date(product.purchase_date), 'MMM d, yyyy') : 'N/A'})
                          </span>
                        </p>
                        {product.sale_date && (
                          <p className="text-sm">
                            Sale: £{product.sale_price_including_VAT?.toFixed(2)}
                            <span className="text-[#2A2A2A]/50 ml-2">
                              ({format(new Date(product.sale_date), 'MMM d, yyyy')})
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
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

      <Dialog open={isNewProductDialogOpen} onOpenChange={setIsNewProductDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product for {customer.first_name} {customer.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={newProduct.model}
                onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newProduct.product_category}
                onValueChange={(value) => setNewProduct({ ...newProduct, product_category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheme">Scheme</Label>
              <Select
                value={newProduct.scheme}
                onValueChange={(value) => setNewProduct({ ...newProduct, scheme: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Schemes</SelectLabel>
                    <SelectItem value="buy-back">Buy Back</SelectItem>
                    <SelectItem value="pawn">Pawn</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchase_price">Purchase Price (inc. VAT)</Label>
              <Input
                id="purchase_price"
                type="number"
                value={newProduct.purchase_price_including_VAT}
                onChange={(e) => setNewProduct({ ...newProduct, purchase_price_including_VAT: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input
                id="purchase_date"
                type="date"
                value={newProduct.purchase_date}
                onChange={(e) => setNewProduct({ ...newProduct, purchase_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewProductDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProduct}>
              Create Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerProfile;
