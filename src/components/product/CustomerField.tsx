
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Customer, EditProductFormProps } from "./types";

export const CustomerField = ({ form, customers }: EditProductFormProps) => {
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
              <div className="relative">
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
                {foundCustomer && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-8 top-0 h-full hover:bg-transparent"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      form.setValue("customer_id", "");
                      setOpen(false);
                    }}
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </Button>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
