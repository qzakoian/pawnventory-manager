
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

interface AddProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: NewProduct) => void;
  customerName: string;
  categories: string[];
  schemes: string[];
}

export const AddProductDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  customerName,
  categories,
  schemes,
}: AddProductDialogProps) => {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    model: "",
    product_category: "",
    scheme: "buy-back",
    purchase_price_including_VAT: 0,
    purchase_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = () => {
    onSubmit(newProduct);
    setNewProduct({
      model: "",
      product_category: "",
      scheme: "buy-back",
      purchase_price_including_VAT: 0,
      purchase_date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Create a new product for {customerName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={newProduct.model}
              onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={newProduct.product_category}
              onValueChange={(value) => setNewProduct({ ...newProduct, product_category: value })}
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
              onValueChange={(value) => setNewProduct({ ...newProduct, scheme: value })}
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
          <div className="space-y-2">
            <Label htmlFor="purchase_price">Purchase Price (inc. VAT)</Label>
            <Input
              id="purchase_price"
              type="number"
              value={newProduct.purchase_price_including_VAT}
              onChange={(e) => setNewProduct({ ...newProduct, purchase_price_including_VAT: parseFloat(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input
              id="purchase_date"
              type="date"
              value={newProduct.purchase_date}
              onChange={(e) => setNewProduct({ ...newProduct, purchase_date: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
