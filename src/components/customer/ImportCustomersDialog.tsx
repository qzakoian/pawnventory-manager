
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import Papa from 'papaparse';
import { useQueryClient } from "@tanstack/react-query";

interface ImportCustomersDialogProps {
  shopId: number;
}

interface CSVCustomer {
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  postal_code?: string;
  county?: string;
}

export function ImportCustomersDialog({ shopId }: ImportCustomersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const text = await file.text();
      
      Papa.parse(text, {
        header: true,
        complete: async (results) => {
          const customers = results.data as CSVCustomer[];
          
          if (customers.length === 0) {
            throw new Error("No customers found in CSV file");
          }

          // Validate required fields
          const invalidCustomers = customers.filter(
            customer => !customer.first_name || !customer.last_name
          );

          if (invalidCustomers.length > 0) {
            throw new Error("All customers must have first and last names");
          }

          // Prepare customers data with shop_id
          const customersWithShopId = customers.map(customer => ({
            ...customer,
            shop_id: shopId
          }));

          const { error } = await supabase
            .from('Customers')
            .insert(customersWithShopId);

          if (error) throw error;

          toast({
            title: "Success",
            description: `Successfully imported ${customers.length} customers`,
          });

          // Refresh customers list
          queryClient.invalidateQueries({ queryKey: ['customers', shopId] });
          setIsOpen(false);
        },
        error: (error) => {
          throw new Error(`Error parsing CSV: ${error.message}`);
        }
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import customers",
      });
    } finally {
      setIsUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import Customers
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Customers from CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with the following columns: first_name, last_name, email,
            phone_number, address_line1, address_line2, city, postal_code, county
          </p>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <div className="text-sm text-muted-foreground">
            <p>Required columns:</p>
            <ul className="list-disc list-inside">
              <li>first_name</li>
              <li>last_name</li>
            </ul>
            <p className="mt-2">Optional columns:</p>
            <ul className="list-disc list-inside">
              <li>email</li>
              <li>phone_number</li>
              <li>address_line1</li>
              <li>address_line2</li>
              <li>city</li>
              <li>postal_code</li>
              <li>county</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
