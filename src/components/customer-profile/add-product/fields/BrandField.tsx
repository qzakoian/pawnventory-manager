
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface BrandFieldProps {
  brand: string;
  onChange: (value: string) => void;
  brands: string[];
}

export const BrandField = ({ brand, onChange, brands }: BrandFieldProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { toast } = useToast();

  const filteredBrands = searchValue
    ? brands.filter((b) =>
        b.toLowerCase().includes(searchValue.toLowerCase())
      )
    : brands;

  const handleCreateBrand = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!searchValue) return;
    
    if (brands.some(b => b.toLowerCase() === searchValue.toLowerCase())) {
      toast({
        title: "Brand already exists",
        description: "Please select it from the list.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('Brands')
      .insert([{ name: searchValue }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create brand.",
        variant: "destructive",
      });
      return;
    }

    onChange(searchValue);
    setOpen(false);
    setSearchValue("");

    toast({
      title: "Success",
      description: "Brand created successfully.",
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="brand">Brand</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {brand || "Select brand..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 z-50" align="start">
          <div className="flex items-center border-b px-3">
            <Input
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0"
              placeholder="Search brands..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredBrands.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                <p className="mb-2">No brands found.</p>
                {searchValue && (
                  <div className="relative pointer-events-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full relative z-50 pointer-events-auto cursor-pointer"
                      onClick={handleCreateBrand}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create "{searchValue}"
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-1">
                {filteredBrands.map((b) => (
                  <div 
                    key={b}
                    className="relative pointer-events-auto"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <button
                      type="button"
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground pointer-events-auto",
                        brand === b && "bg-accent text-accent-foreground"
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onChange(b);
                        setOpen(false);
                        setSearchValue("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          brand === b ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {b}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
