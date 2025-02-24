
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_COLUMNS } from "./types";
import type { ColumnMapping } from "./types";

interface MappingStepProps {
  csvColumns: string[];
  columnMapping: ColumnMapping;
  onColumnMap: (csvColumn: string, dbColumn: string | null) => void;
  onImport: () => void;
}

export function MappingStep({
  csvColumns,
  columnMapping,
  onColumnMap,
  onImport
}: MappingStepProps) {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        Map your CSV columns to our database fields. Last Name is required.
      </p>
      <div className="space-y-4">
        {csvColumns.map((csvColumn) => (
          <div key={csvColumn} className="flex items-center gap-4">
            <span className="min-w-[200px] text-sm">{csvColumn}</span>
            <Select
              value={columnMapping[csvColumn] || "do_not_import"}
              onValueChange={(value) => onColumnMap(csvColumn, value === "do_not_import" ? null : value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Map to field..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="do_not_import">Do not import</SelectItem>
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
          <Button onClick={onImport} className="w-full">
            Import Customers
          </Button>
        </div>
      </div>
    </>
  );
}
