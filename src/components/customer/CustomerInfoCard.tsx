
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
    <Card className="p-8 bg-gradient-to-br from-white to-secondary/5 backdrop-blur-sm border border-border/20 shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-6">
          <div className="bg-gradient-to-br from-[#646ECB] to-[#8B5CF6] p-4 rounded-2xl shadow-md text-white">
            <User className="h-7 w-7" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-[#2A2A2A]">
              {customer.first_name} {customer.last_name}
            </h2>
            <p className="text-[#2A2A2A]/70 font-medium">Customer ID: {customer.id}</p>
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
              <div className="text-sm text-[#2A2A2A]/70 mt-4 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
                <p className="font-medium mb-2">Address:</p>
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
          className="ml-4 hover:bg-secondary/10 transition-colors"
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
    </Card>
  );
};
