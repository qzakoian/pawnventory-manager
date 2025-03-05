
import { useShop } from "@/contexts/ShopContext";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
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
import { ArrowRight, Home } from "lucide-react";
import { CustomerSearch } from "@/components/customer/CustomerSearch";
import { ImportCustomersDialog } from "@/components/customer/ImportCustomersDialog";
import { Button } from "@/components/ui/button";

const Customers = () => {
  const { selectedShop } = useShop();
  const navigate = useNavigate();
  
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', selectedShop?.id],
    queryFn: async () => {
      if (!selectedShop) return [];
      
      const { data, error } = await supabase
        .from('Customers')
        .select('*')
        .eq('shop_id', selectedShop.id)
        .order('created_at', { ascending: false });
        
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
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-foreground">Customers</h1>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/')} 
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </div>
            {selectedShop && <ImportCustomersDialog shopId={selectedShop.id} />}
          </div>
          
          {selectedShop && <CustomerSearch shopId={selectedShop.id} />}
          
          <Card className="mt-8">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Loading customers...
                      </TableCell>
                    </TableRow>
                  ) : customers?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers?.map((customer) => (
                      <TableRow 
                        key={customer.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => navigate(`/customer/${customer.id}`)}
                      >
                        <TableCell>
                          {customer.first_name} {customer.last_name}
                        </TableCell>
                        <TableCell>
                          {customer.email && (
                            <div>{customer.email}</div>
                          )}
                          {customer.phone_number && (
                            <div className="text-gray-500">{customer.phone_number}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {[customer.city, customer.postal_code]
                            .filter(Boolean)
                            .join(", ")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(customer.created_at), "MMM d, yyyy")}
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

export default Customers;
