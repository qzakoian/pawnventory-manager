
import { format } from "date-fns";
import { User, Pencil, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";

interface CustomerInfoCardProps {
  customer: Customer;
  onEditClick: () => void;
}

export const CustomerInfoCard = ({ customer, onEditClick }: CustomerInfoCardProps) => {
  return (
    <div className="glass-card rounded-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#2A2A2A]">Customer Information</h2>
          <Button 
            variant="outline" 
            onClick={onEditClick}
            className="hover:bg-secondary/10 transition-colors"
            size="sm"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="bg-[#646ECB] p-3 rounded-full">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-[#2A2A2A]">
                {customer.first_name} {customer.last_name}
              </h3>
              <p className="text-sm text-gray-500">ID: {customer.id}</p>
            </div>
          </div>

          <div className="space-y-4">
            {customer.email && (
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{customer.email}</span>
              </div>
            )}
            
            {customer.phone_number && (
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{customer.phone_number}</span>
              </div>
            )}

            {(customer.address_line1 || customer.city || customer.postal_code) && (
              <div className="flex space-x-3 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="space-y-1">
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
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Customer since {format(new Date(customer.created_at), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
