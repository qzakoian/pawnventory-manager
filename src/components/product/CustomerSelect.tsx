
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Customer } from "@/types/customer";

interface CustomerSelectProps {
  customers: Array<{ id: number; first_name: string | null; last_name: string | null; }>;
  selectedCustomer: Customer | null;
  onCustomerSelect: (customerId: number | null) => void;
  isLoading: boolean;
}

export const CustomerSelect = ({
  customers,
  selectedCustomer,
  onCustomerSelect,
  isLoading
}: CustomerSelectProps) => {
  const [open, setOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const getCustomerDisplayName = (customer: { first_name: string | null; last_name: string | null }) => {
    return [customer.first_name, customer.last_name]
      .filter(name => name !== null)
      .join(" ") || "Unnamed Customer";
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchTerm = customerSearch.toLowerCase();
    const customerName = getCustomerDisplayName(customer).toLowerCase();
    return customerName.includes(searchTerm);
  });

  return (
    <div>
      <h3 className="text-sm text-gray-500 mb-2">Customer</h3>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between cursor-default",
              !selectedCustomer && "text-muted-foreground"
            )}
          >
            {selectedCustomer 
              ? getCustomerDisplayName(selectedCustomer)
              : "Select customer"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          {isLoading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading customers...</div>
          ) : (
            <Command>
              <CommandInput 
                placeholder="Search customer..." 
                value={customerSearch}
                onValueChange={setCustomerSearch}
              />
              <CommandList>
                <CommandEmpty>No customer found.</CommandEmpty>
                {filteredCustomers.length > 0 && (
                  <CommandGroup>
                    {filteredCustomers.map((customer) => (
                      <CommandItem
                        key={customer.id}
                        onSelect={() => {
                          onCustomerSelect(customer.id);
                          setCustomerSearch("");
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {getCustomerDisplayName(customer)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
