
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const getCustomerDisplayName = (customer: Customer) => {
    return [customer.first_name, customer.last_name]
      .filter(name => name !== null)
      .join(" ") || "Unnamed Customer";
  };

  const filteredCustomers = (customers || []).filter((customer) => {
    const searchTerm = customerSearch.toLowerCase();
    const customerName = getCustomerDisplayName(customer).toLowerCase();
    return customerName.includes(searchTerm);
  });

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
                      value={category.name || "uncategorized"}
                    >
                      {category.name || "Uncategorized"}
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
        render={({ field }) => {
          const foundCustomer = field.value && field.value !== "none" 
            ? customers?.find((customer) => String(customer.id) === field.value)
            : null;

          return (
            <FormItem>
              <FormLabel>Customer (optional)</FormLabel>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {foundCustomer 
                        ? getCustomerDisplayName(foundCustomer)
                        : "Select customer"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command value={field.value || ""}>
                      <CommandInput 
                        placeholder="Search customer..." 
                        value={customerSearch}
                        onValueChange={setCustomerSearch}
                      />
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup heading="Customers">
                        <CommandItem
                          key="none"
                          value="none"
                          onSelect={() => {
                            form.setValue("customer_id", "none");
                            setCustomerSearch("");
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === "none" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          None
                        </CommandItem>
                        {filteredCustomers.map((customer) => (
                          <CommandItem
                            key={`customer-${customer.id}`}
                            value={String(customer.id)}
                            onSelect={() => {
                              form.setValue("customer_id", String(customer.id));
                              setCustomerSearch("");
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value === String(customer.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {getCustomerDisplayName(customer)}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
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
