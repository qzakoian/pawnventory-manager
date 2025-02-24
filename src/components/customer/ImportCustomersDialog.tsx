
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
import { Download, Upload } from "lucide-react";
import Papa from 'papaparse';
import { useQueryClient } from "@tanstack/react-query";

interface ImportCustomersDialogProps {
  shopId: number;
}

interface CSVCustomer {
  first_name?: string;
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
        skipEmptyLines: true, // Skip empty lines
        complete: async (results) => {
          const parsedData = results.data as CSVCustomer[];
          
          if (parsedData.length === 0) {
            throw new Error("No customers found in CSV file");
          }

          // Filter out empty rows and validate last_name
          const validCustomers = parsedData.filter(customer => 
            customer && 
            typeof customer === 'object' && 
            'last_name' in customer && 
            customer.last_name && 
            customer.last_name.trim() !== ''
          );

          if (validCustomers.length === 0) {
            throw new Error("No valid customers found. Each customer must have a last name");
          }

          if (validCustomers.length < parsedData.length) {
            toast({
              title: "Warning",
              description: `${parsedData.length - validCustomers.length} invalid rows were skipped`,
              variant: "default",
            });
          }

          // Prepare customers data with shop_id
          const customersWithShopId = validCustomers.map(customer => ({
            ...customer,
            shop_id: shopId,
            // Ensure all string fields are properly trimmed
            last_name: customer.last_name.trim(),
            first_name: customer.first_name?.trim(),
            email: customer.email?.trim(),
            phone_number: customer.phone_number?.trim(),
            address_line1: customer.address_line1?.trim(),
            address_line2: customer.address_line2?.trim(),
            city: customer.city?.trim(),
            postal_code: customer.postal_code?.trim(),
            county: customer.county?.trim(),
          }));

          const { error } = await supabase
            .from('Customers')
            .insert(customersWithShopId);

          if (error) throw error;

          toast({
            title: "Success",
            description: `Successfully imported ${validCustomers.length} customers`,
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

  const downloadTemplate = () => {
    const headers = [
      'last_name',
      'first_name',
      'email',
      'phone_number',
      'address_line1',
      'address_line2',
      'city',
      'postal_code',
      'county'
    ];

    const csvContent = Papa.unparse({
      fields: headers,
      data: [
        {
          last_name: 'Smith',
          first_name: 'John',
          email: 'john.smith@example.com',
          phone_number: '123-456-7890',
          address_line1: '123 Main St',
          address_line2: 'Apt 4B',
          city: 'Springfield',
          postal_code: '12345',
          county: 'Hampshire'
        }
      ]
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'customer_import_template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
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
            Upload a CSV file with the following columns: last_name, first_name, email,
            phone_number, address_line1, address_line2, city, postal_code, county
          </p>
          <div className="flex justify-between items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
              className="whitespace-nowrap"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Required column:</p>
            <ul className="list-disc list-inside">
              <li>last_name</li>
            </ul>
            <p className="mt-2">Optional columns:</p>
            <ul className="list-disc list-inside">
              <li>first_name</li>
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
