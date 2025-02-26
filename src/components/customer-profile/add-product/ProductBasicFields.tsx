
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewProduct } from "@/types/customer";
import { useToast } from "@/components/ui/use-toast";

interface ProductBasicFieldsProps {
  newProduct: NewProduct;
  onProductChange: (product: NewProduct) => void;
  brands: string[];
  categories: string[];
  schemes: string[];
}

export const ProductBasicFields = ({
  newProduct,
  onProductChange,
  brands = [], // Ensure brands has a default value
  categories,
  schemes,
}: ProductBasicFieldsProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { toast } = useToast();

  const filteredBrands = searchValue
    ? brands.filter((brand) =>
        brand.toLowerCase().includes(searchValue.toLowerCase())
      )
    : brands;

  const handleCreateBrand = async () => {
    if (!searchValue) return;
    
    // Check if brand already exists (case insensitive)
    if (brands.some(brand => brand.toLowerCase() === searchValue.toLowerCase())) {
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

    onProductChange({ ...newProduct, brand: searchValue });
    setOpen(false);
    setSearchValue("");

    toast({
      title: "Success",
      description: "Brand created successfully.",
    });
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={newProduct.model}
          onChange={(e) => onProductChange({ ...newProduct, model: e.target.value })}
        />
      </div>
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
              {newProduct.brand || "Select brand..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[300px] p-0">
            <Command>
              <CommandInput 
                placeholder="Search brands..." 
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandEmpty className="p-2">
                <p className="text-sm text-muted-foreground mb-2">No brands found.</p>
                {searchValue && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleCreateBrand}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create "{searchValue}"
                  </Button>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredBrands.map((brand) => (
                  <CommandItem
                    key={brand}
                    value={brand}
                    onSelect={() => {
                      onProductChange({ ...newProduct, brand });
                      setOpen(false);
                      setSearchValue("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        newProduct.brand === brand ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {brand}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={newProduct.product_category}
          onValueChange={(value) => onProductChange({ ...newProduct, product_category: value })}
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
          onValueChange={(value) => onProductChange({ ...newProduct, scheme: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select scheme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Schemes</SelectLabel>
              {schemes.map((scheme) => (
                <SelectItem key={scheme} value={scheme}>
                  {scheme}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
