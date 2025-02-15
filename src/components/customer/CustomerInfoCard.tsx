
import { format } from "date-fns";
import { User, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Customer } from "@/types/customer";

interface CustomerInfoCardProps {
  customer: Customer;
  onEditClick: () => void;
}

export const CustomerInfoCard = ({ customer, onEditClick }: CustomerInfoCardProps) => {
  return (
    <Card className="p-6 bg-white shadow-sm border-0">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="bg-[#646ECB] p-3 rounded-full text-white">
            <User className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">
              {customer.first_name} {customer.last_name}
            </h2>
            <p className="text-[#2A2A2A]/70">Customer ID: {customer.id}</p>
            <p className="text-sm text-[#2A2A2A]/70">
              Created: {format(new Date(customer.created_at), 'MMM d, yyyy')}
            </p>
            {customer.email && (
              <p className="text-sm text-[#2A2A2A]/70">Email: {customer.email}</p>
            )}
            {customer.phone_number && (
              <p className="text-sm text-[#2A2A2A]/70">Phone: {customer.phone_number}</p>
            )}
            {(customer.address_line1 || customer.address_line2 || customer.city || customer.postal_code || customer.county) && (
              <div className="text-sm text-[#2A2A2A]/70">
                <p className="font-medium">Address:</p>
                {customer.address_line1 && <p>{customer.address_line1}</p>}
                {customer.address_line2 && <p>{customer.address_line2}</p>}
                <p>
                  {[
                    customer.city,
                    customer.county,
                    customer.postal_code
                  ].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={onEditClick}
          className="ml-4"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
    </Card>
  );
};
