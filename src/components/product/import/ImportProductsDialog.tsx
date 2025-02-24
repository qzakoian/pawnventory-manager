
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import Papa from 'papaparse';
import { useQueryClient } from "@tanstack/react-query";
import { UploadStep } from "./UploadStep";
import { MappingStep } from "./MappingStep";
import { downloadTemplateCSV, downloadCustomersList, createInitialMapping, validateAndTransformProducts } from "./csvUtils";
import { REQUIRED_COLUMNS, type ImportProductsDialogProps, type ColumnMapping } from "./types";

export function ImportProductsDialog({ shopId }: ImportProductsDialogProps) {
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
          setColumnMapping(createInitialMapping(headers));
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

  const handleColumnMap = (csvColumn: string, dbColumn: string | null) => {
    setColumnMapping(prev => {
      const newMapping = { ...prev };
      if (dbColumn === null) {
        delete newMapping[csvColumn];
      } else {
        newMapping[csvColumn] = dbColumn;
      }
      return newMapping;
    });
  };

  const handleImport = async () => {
    try {
      const mappedColumns = Object.values(columnMapping);
      const missingRequired = REQUIRED_COLUMNS.filter(col => !mappedColumns.includes(col));

      if (missingRequired.length > 0) {
        throw new Error(`Please map the required columns: ${missingRequired.join(', ')}`);
      }

      const validProducts = validateAndTransformProducts(csvData, columnMapping, shopId);

      if (validProducts.length === 0) {
        throw new Error("No valid products found. Each product must have a model name");
      }

      if (validProducts.length < csvData.length) {
        toast({
          title: "Warning",
          description: `${csvData.length - validProducts.length} invalid rows were skipped`,
          variant: "default",
        });
      }

      const { error } = await supabase
        .from('Products')
        .insert(validProducts);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully imported ${validProducts.length} products`,
      });

      setShowMapping(false);
      setCsvColumns([]);
      setCsvData([]);
      setColumnMapping({});
      queryClient.invalidateQueries({ queryKey: ['products', shopId] });
      setIsOpen(false);
    } catch (error) {
      console.error('Import error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import products",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import Products
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Import Products from CSV</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!showMapping ? (
            <UploadStep
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
              onDownloadTemplate={downloadTemplateCSV}
              onDownloadCustomers={() => downloadCustomersList(shopId)}
            />
          ) : (
            <MappingStep
              csvColumns={csvColumns}
              columnMapping={columnMapping}
              onColumnMap={handleColumnMap}
              onImport={handleImport}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
