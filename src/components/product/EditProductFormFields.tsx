
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

interface ProductCategory {
  name: string | null;
}

interface Customer {
  id: number;
  first_name: string | null;
  last_name: string | null;
}

interface EditProductFormFieldsProps {
  form: UseFormReturn<z.infer<typeof editProductSchema>>;
  categories: ProductCategory[] | undefined;
  customers: Customer[] | undefined;
}

const editProductSchema = z.object({
  model: z.string().min(1, "Model is required"),
  imei: z.string().optional(),
  sku: z.string().optional(),
  product_category: z.string().min(1, "Category is required"),
  purchase_price_including_VAT: z.number().min(0, "Price must be positive"),
  customer_id: z.string().optional(),
});

export { editProductSchema };

export const EditProductFormFields = ({ form, categories, customers }: EditProductFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="imei"
        render={({ field }) => (
          <FormItem>
            <FormLabel>IMEI (optional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SKU (optional)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="product_category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem 
                      key={category.name} 
                      value={category.name || ""}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="customer_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer (optional)</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {customers?.map((customer) => (
                    <SelectItem 
                      key={customer.id} 
                      value={String(customer.id)}
                    >
                      {customer.first_name} {customer.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="purchase_price_including_VAT"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Purchase Price (inc. VAT)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={e => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
