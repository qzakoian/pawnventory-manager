
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  brands,
  categories,
  schemes,
}: ProductBasicFieldsProps) => {
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
        <Select
          value={newProduct.brand}
          onValueChange={(value) => onProductChange({ ...newProduct, brand: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Brands</SelectLabel>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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
