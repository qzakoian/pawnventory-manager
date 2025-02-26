
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
  brands = [],
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

  const handleCreateBrand = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent event bubbling
    e.stopPropagation(); // Ensure the event doesn't propagate
    
    if (!searchValue) return;
    
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
          <PopoverContent className="w-[300px] p-0" align="start">
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
                  {filteredBrands.map((brand) => (
                    <button
                      type="button"
                      key={brand}
                      className={cn(
                        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                        newProduct.brand === brand && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => {
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
                    </button>
                  ))}
                </div>
              )}
            </div>
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
