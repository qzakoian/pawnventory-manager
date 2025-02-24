
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface ColumnMapping {
  [key: string]: string;
}

const REQUIRED_COLUMNS = ['last_name'];
const OPTIONAL_COLUMNS = [
  'first_name',
  'email',
  'phone_number',
  'address_line1',
  'address_line2',
  'city',
  'postal_code',
  'county'
];
const ALL_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS];

export function ImportCustomersDialog({ shopId }: ImportCustomersDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [csvData, setCsvData] = useState<any[]>([]);
  const [showMapping, setShowMapping] = useState(false);
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
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.meta.fields || [];
          setCsvColumns(headers);
          setCsvData(results.data);
          
          // Create initial mapping suggestion based on matching column names
          const initialMapping: ColumnMapping = {};
          headers.forEach(header => {
            if (ALL_COLUMNS.includes(header)) {
              initialMapping[header] = header;
            }
          });
          setColumnMapping(initialMapping);
          setShowMapping(true);
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
        description: error instanceof Error ? error.message : "Failed to parse CSV",
      });
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const handleColumnMap = (csvColumn: string, dbColumn: string) => {
    setColumnMapping(prev => ({
      ...prev,
      [csvColumn]: dbColumn
    }));
  };

  const handleImport = async () => {
    try {
      // Check if required columns are mapped
      const mappedColumns = Object.values(columnMapping);
      const missingRequired = REQUIRED_COLUMNS.filter(col => !mappedColumns.includes(col));

      if (missingRequired.length > 0) {
        throw new Error(`Please map the required columns: ${missingRequired.join(', ')}`);
      }

      // Transform data using the mapping
      const transformedData = csvData.map(row => {
        const transformed: any = { shop_id: shopId };
        Object.entries(columnMapping).forEach(([csvCol, dbCol]) => {
          const value = row[csvCol]?.trim();
          if (value) {
            transformed[dbCol] = value;
          }
        });
        return transformed;
      });

      // Filter out rows without required fields
      const validCustomers = transformedData.filter(customer => 
        customer.last_name && customer.last_name.trim() !== ''
      );

      if (validCustomers.length === 0) {
        throw new Error("No valid customers found. Each customer must have a last name");
      }

      if (validCustomers.length < transformedData.length) {
        toast({
          title: "Warning",
          description: `${transformedData.length - validCustomers.length} invalid rows were skipped`,
          variant: "default",
        });
      }

      const { error } = await supabase
        .from('Customers')
        .insert(validCustomers);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully imported ${validCustomers.length} customers`,
      });

      // Reset state and close dialog
      setShowMapping(false);
      setCsvColumns([]);
      setCsvData([]);
      setColumnMapping({});
      queryClient.invalidateQueries({ queryKey: ['customers', shopId] });
      setIsOpen(false);
    } catch (error) {
      console.error('Import error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import customers",
      });
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import Customers from CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!showMapping ? (
            <>
              <p className="text-sm text-muted-foreground">
                Upload a CSV file containing your customer data. You'll be able to map your columns to our required fields in the next step.
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
                <p>Required fields:</p>
                <ul className="list-disc list-inside">
                  <li>Last Name</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Map your CSV columns to our database fields. Last Name is required.
              </p>
              <div className="space-y-4">
                {csvColumns.map((csvColumn) => (
                  <div key={csvColumn} className="flex items-center gap-4">
                    <span className="min-w-[200px] text-sm">{csvColumn}</span>
                    <Select
                      value={columnMapping[csvColumn] || ""}
                      onValueChange={(value) => handleColumnMap(csvColumn, value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Map to field..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Do not import</SelectItem>
                        {ALL_COLUMNS.map((dbColumn) => (
                          <SelectItem key={dbColumn} value={dbColumn}>
                            {dbColumn.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <div className="pt-4">
                  <Button onClick={handleImport} className="w-full">
                    Import Customers
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
