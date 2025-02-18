
import { Card } from "@/components/ui/card";
import { CustomerSelect } from "./CustomerSelect";

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
      <div className="flex-1">
        <CustomerSelect
          customers={customers}
          selectedCustomer={selectedCustomer}
          onCustomerSelect={onCustomerUpdate}
          isLoading={isLoadingCustomers}
        />
      </div>
    </Card>
  );
};
