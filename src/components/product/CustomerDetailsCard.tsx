
import { Card } from "@/components/ui/card";
import { CustomerSelect } from "./CustomerSelect";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CustomerDetailsCardProps {
  customers: Array<{ id: number; first_name: string | null; last_name: string | null; }>;
  selectedCustomer: { id: number; first_name: string | null; last_name: string | null; } | null;
  isLoadingCustomers: boolean;
  onCustomerUpdate: (customerId: number | null) => void;
}

export const CustomerDetailsCard = ({
  customers,
  selectedCustomer,
  isLoadingCustomers,
  onCustomerUpdate
}: CustomerDetailsCardProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Customer Assignment</h2>
      <div className="flex gap-3 items-start">
        <div className="flex-1">
          <CustomerSelect
            customers={customers}
            selectedCustomer={selectedCustomer}
            onCustomerSelect={onCustomerUpdate}
            isLoading={isLoadingCustomers}
          />
        </div>
        {selectedCustomer && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onCustomerUpdate(null)}
            className="mt-8"
          >
            <X className="h-4 w-4 mr-2" />
            Remove customer
          </Button>
        )}
      </div>
    </Card>
  );
};
