
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { ArrowRight, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Customer {
  id: number;
  first_name: string | null;
  last_name: string | null;
}

interface CustomerSearchProps {
  shopId: number;
}

export const CustomerSearch = ({ shopId }: CustomerSearchProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCustomerSearch(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCustomerSearch = async (query: string) => {
    if (!query.trim() || !shopId) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('Customers')
        .select('id, first_name, last_name')
        .eq('shop_id', shopId)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .limit(5);

      if (error) throw error;

      setSearchResults(data || []);

      if (data && data.length === 0 && query.trim() !== '') {
        toast({
          description: "No customers found",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error searching customers:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search for customers",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="p-4 glass-card">
      <h3 className="text-lg font-medium text-[#111111] mb-4">Find a Customer</h3>
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Input 
            placeholder="Search by name..." 
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchResults.length > 0 && (
          <div className="mt-2 space-y-1">
            {searchResults.map((customer) => (
              <div
                key={customer.id}
                className="p-2 hover:bg-gray-50 rounded-md cursor-pointer flex items-center justify-between"
                onClick={() => {
                  navigate(`/customer/${customer.id}`);
                }}
              >
                <span>{customer.first_name} {customer.last_name}</span>
                <ArrowRight className="h-4 w-4 text-[#646ECB]" />
              </div>
            ))}
          </div>
        )}
        <button 
          onClick={() => navigate('/customers/new')}
          className="text-[#646ECB] hover:text-[#646ECB]/90 hover:underline inline-flex items-center text-sm mt-2 gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Create Customer
        </button>
      </div>
    </Card>
  );
};
