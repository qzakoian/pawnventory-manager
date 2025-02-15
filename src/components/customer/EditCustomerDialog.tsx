
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Customer, EditCustomer } from "@/types/customer";
import { isValidUKPhoneNumber, isValidUKPostcode } from "@/utils/validation";

interface EditCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSave: (editedCustomer: EditCustomer) => void;
}

export const EditCustomerDialog = ({
  open,
  onOpenChange,
  customer,
  onSave,
}: EditCustomerDialogProps) => {
  const [editCustomer, setEditCustomer] = useState<EditCustomer>({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    address_line1: "",
    address_line2: "",
    city: "",
    postal_code: "",
    county: "",
  });

  useEffect(() => {
    if (customer) {
      setEditCustomer({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        phone_number: customer.phone_number || "",
        email: customer.email || "",
        address_line1: customer.address_line1 || "",
        address_line2: customer.address_line2 || "",
        city: customer.city || "",
        postal_code: customer.postal_code || "",
        county: customer.county || "",
      });
    }
  }, [customer]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Customer Profile</DialogTitle>
          <DialogDescription>
            Update the customer's information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              value={editCustomer.first_name}
              onChange={(e) => setEditCustomer({ ...editCustomer, first_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              value={editCustomer.last_name}
              onChange={(e) => setEditCustomer({ ...editCustomer, last_name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number (optional)</Label>
            <Input
              id="phone_number"
              value={editCustomer.phone_number}
              onChange={(e) => {
                const input = e.target.value;
                const sanitized = input.replace(/[^\d\s+-]/g, '');
                setEditCustomer({ ...editCustomer, phone_number: sanitized });
              }}
              placeholder="Enter UK mobile number (e.g., 07123456789)"
              className={!isValidUKPhoneNumber(editCustomer.phone_number) && editCustomer.phone_number 
                ? "border-red-500" 
                : ""}
            />
            {!isValidUKPhoneNumber(editCustomer.phone_number) && editCustomer.phone_number && (
              <p className="text-sm text-red-500 mt-1">
                Please enter a valid UK mobile number
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={editCustomer.email}
              onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Address (optional)</h3>
            <div className="space-y-2">
              <Label htmlFor="address_line1">Address Line 1</Label>
              <Input
                id="address_line1"
                value={editCustomer.address_line1}
                onChange={(e) => setEditCustomer({ ...editCustomer, address_line1: e.target.value })}
                placeholder="House number and street name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_line2">Address Line 2</Label>
              <Input
                id="address_line2"
                value={editCustomer.address_line2}
                onChange={(e) => setEditCustomer({ ...editCustomer, address_line2: e.target.value })}
                placeholder="Apartment, suite, unit, etc. (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Town/City</Label>
              <Input
                id="city"
                value={editCustomer.city}
                onChange={(e) => setEditCustomer({ ...editCustomer, city: e.target.value })}
                placeholder="Town or city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="county">County</Label>
              <Input
                id="county"
                value={editCustomer.county}
                onChange={(e) => setEditCustomer({ ...editCustomer, county: e.target.value })}
                placeholder="County"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postal_code">Postcode</Label>
              <Input
                id="postal_code"
                value={editCustomer.postal_code}
                onChange={(e) => setEditCustomer({ ...editCustomer, postal_code: e.target.value })}
                placeholder="Postcode"
                className={!isValidUKPostcode(editCustomer.postal_code) && editCustomer.postal_code 
                  ? "border-red-500" 
                  : ""}
              />
              {!isValidUKPostcode(editCustomer.postal_code) && editCustomer.postal_code && (
                <p className="text-sm text-red-500 mt-1">
                  Please enter a valid UK postcode
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(editCustomer)}>
            Update Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
