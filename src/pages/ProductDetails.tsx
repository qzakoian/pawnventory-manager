
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft, Edit, Check, ChevronsUpDown, X } from "lucide-react";
import { ShopsDropdown } from "@/components/ShopsDropdown";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      const productId = parseInt(id);
      if (isNaN(productId)) throw new Error('Invalid product ID');

      const { data, error } = await supabase
        .from('Products')
        .select('*, customer:Customers(*)')
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Customers')
        .select('id, first_name, last_name')
        .order('first_name');
      
      if (error) throw error;
      return data;
    },
  });

  const getCustomerDisplayName = (customer: { first_name: string | null; last_name: string | null }) => {
    return [customer.first_name, customer.last_name]
      .filter(name => name !== null)
      .join(" ") || "Unnamed Customer";
  };

  const filteredCustomers = customers?.filter((customer) => {
    const searchTerm = customerSearch.toLowerCase();
    const customerName = getCustomerDisplayName(customer).toLowerCase();
    return customerName.includes(searchTerm);
  }) ?? [];

  const updateCustomer = async (customerId: string | null) => {
    try {
      const { error } = await supabase
        .from('Products')
        .update({ customer_id: customerId ? parseInt(customerId) : null })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update customer",
      });
    }
  };

  if (isLoadingProduct) {
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

              <div>
                <h3 className="text-sm text-gray-500 mb-2">Customer</h3>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between",
                        !product.customer && "text-muted-foreground"
                      )}
                    >
                      {product.customer 
                        ? getCustomerDisplayName(product.customer)
                        : "Select customer"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    {isLoadingCustomers ? (
                      <div className="p-4 text-sm text-muted-foreground">Loading customers...</div>
                    ) : (
                      <Command className="w-full">
                        <CommandInput 
                          placeholder="Search customer..." 
                          value={customerSearch}
                          onValueChange={setCustomerSearch}
                        />
                        <CommandEmpty>No customer found.</CommandEmpty>
                        {filteredCustomers.length > 0 && (
                          <CommandGroup>
                            {filteredCustomers.map((customer) => (
                              <CommandItem
                                key={customer.id}
                                value={String(customer.id)}
                                onSelect={(value) => {
                                  updateCustomer(value);
                                  setCustomerSearch("");
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    product.customer_id === customer.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {getCustomerDisplayName(customer)}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </Command>
                    )}
                  </PopoverContent>
                </Popover>
                {product.customer && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => updateCustomer(null)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove customer
                  </Button>
                )}
              </div>
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
      </main>
    </div>
  );
};

export default ProductDetails;
