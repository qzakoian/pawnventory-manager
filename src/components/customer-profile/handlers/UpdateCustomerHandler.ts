
import { supabase } from "@/integrations/supabase/client";
import { Customer, EditCustomer } from "@/types/customer";
import { useToast } from "@/components/ui/use-toast";
import { 
  formatUKPhoneNumber, 
  isValidUKPhoneNumber, 
  formatPostcode, 
  isValidUKPostcode 
} from "@/utils/validation";

export const useUpdateCustomer = (
  customer: Customer | null,
  setCustomer: React.Dispatch<React.SetStateAction<Customer | null>>
) => {
  const { toast } = useToast();

  const handleUpdateCustomer = async (editedCustomer: EditCustomer) => {
    if (!customer) return;

    if (editedCustomer.phone_number && !isValidUKPhoneNumber(editedCustomer.phone_number)) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid UK mobile number",
      });
      return;
    }

    if (editedCustomer.postal_code && !isValidUKPostcode(editedCustomer.postal_code)) {
      toast({
        variant: "destructive",
        title: "Invalid postcode",
        description: "Please enter a valid UK postcode",
      });
      return;
    }

    const formattedPhoneNumber = editedCustomer.phone_number 
      ? formatUKPhoneNumber(editedCustomer.phone_number)
      : '';
    const formattedPostcode = editedCustomer.postal_code 
      ? formatPostcode(editedCustomer.postal_code)
      : '';

    try {
      const updatePayload = {
        first_name: editedCustomer.first_name,
        last_name: editedCustomer.last_name,
        phone_number: formattedPhoneNumber,
        email: editedCustomer.email,
        gender: editedCustomer.gender,
        address_line1: editedCustomer.address_line1,
        address_line2: editedCustomer.address_line2,
        city: editedCustomer.city,
        postal_code: formattedPostcode,
        county: editedCustomer.county,
        customer_type: editedCustomer.customer_type,
        company_name: editedCustomer.company_name,
        vat_number: editedCustomer.vat_number,
      };

      const { data, error } = await supabase
        .from('Customers')
        .update(updatePayload)
        .eq('id', customer.id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const updatedCustomer = data[0] as Customer;
        setCustomer(updatedCustomer);
        
        toast({
          title: "Success",
          description: "Customer profile updated successfully",
        });
        
        return true;
      } else {
        throw new Error('No data returned from update operation');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update customer profile",
      });
      return false;
    }
  };

  return { handleUpdateCustomer };
};
