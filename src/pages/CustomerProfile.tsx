
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
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
import { useShop } from "@/contexts/ShopContext";
import { Customer, Product, NewProduct, EditCustomer } from "@/types/customer";
import { CustomerInfoCard } from "@/components/customer/CustomerInfoCard";
import { CustomerProducts } from "@/components/customer/CustomerProducts";
import { EditCustomerDialog } from "@/components/customer/EditCustomerDialog";
import { formatUKPhoneNumber, formatPostcode, isValidUKPhoneNumber, isValidUKPostcode } from "@/utils/validation";

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedShop } = useShop();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    model: "",
    product_category: "",
    scheme: "buy-back",
    purchase_price_including_VAT: 0,
    purchase_date: new Date().toISOString().split('T')[0],
  });

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

        const { data: customerData, error: customerError } = await supabase
          .from('Customers')
          .select('*')
          .eq('id', customerId)
          .single();

        if (customerError) throw customerError;
        setCustomer(customerData);

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

  const handleUpdateCustomer = async (editedCustomer: EditCustomer) => {
    if (!customer) return;

    if (editedCustomer.phone_number && !isValidUKPhoneNumber(editedCustomer.phone_number)) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid UK mobile number",
      });
      return;
    }

    if (editedCustomer.postal_code && !isValidUKPostcode(editedCustomer.postal_code)) {
      toast({
        variant: "destructive",
        title: "Invalid postcode",
        description: "Please enter a valid UK postcode",
      });
      return;
    }

    const formattedPhoneNumber = editedCustomer.phone_number 
      ? formatUKPhoneNumber(editedCustomer.phone_number)
      : '';
    const formattedPostcode = editedCustomer.postal_code 
      ? formatPostcode(editedCustomer.postal_code)
      : '';

    try {
      const { error } = await supabase
        .from('Customers')
        .update({
          ...editedCustomer,
          phone_number: formattedPhoneNumber,
          postal_code: formattedPostcode,
        })
        .eq('id', customer.id);

      if (error) throw error;

      setCustomer({
        ...customer,
        ...editedCustomer,
        phone_number: formattedPhoneNumber,
        postal_code: formattedPostcode,
      });
      
      setIsEditCustomerDialogOpen(false);
      toast({
        title: "Success",
        description: "Customer profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update customer profile",
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
              Back
            </Button>
            <h1 className="text-2xl font-bold text-[#111111]">Customer Profile</h1>
          </div>
          <Button onClick={() => setIsNewProductDialogOpen(true)} className="bg-[#646ECB] hover:bg-[#4E56A6]">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        <CustomerInfoCard 
          customer={customer} 
          onEditClick={() => setIsEditCustomerDialogOpen(true)} 
        />

        <div>
          <h2 className="text-xl font-bold text-[#111111] mb-4">Customer Products</h2>
          <CustomerProducts products={products} />
        </div>

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

        <EditCustomerDialog
          open={isEditCustomerDialogOpen}
          onOpenChange={setIsEditCustomerDialogOpen}
          customer={customer}
          onSave={handleUpdateCustomer}
        />
      </main>
    </div>
  );
};

export default CustomerProfile;
