
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createCustomerSchema, type CreateCustomerFormData } from "./schemas/customerSchema";
import { PersonalInfoFields } from "./form-sections/PersonalInfoFields";
import { AddressFields } from "./form-sections/AddressFields";

interface CreateCustomerFormProps {
  shopId: number;
  onSuccess?: () => void;
}

export const CreateCustomerForm = ({ shopId, onSuccess }: CreateCustomerFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<CreateCustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      customer_type: "individual",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      gender: "Prefer not to say",
      company_name: "",
      vat_number: "",
      address_line1: "",
      address_line2: "",
      city: "",
      postal_code: "",
      county: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (values: CreateCustomerFormData) => {
    try {
      console.log("Form submitted with values:", values);

      // If we're in company mode, make sure we have company_name
      if (values.customer_type === "company" && !values.company_name) {
        form.setError("company_name", { 
          type: "manual", 
          message: "Company name is required" 
        });
        return;
      }
      
      // If we're in individual mode, make sure we have first_name and last_name
      if (values.customer_type === "individual") {
        if (!values.first_name) {
          form.setError("first_name", { 
            type: "manual", 
            message: "First name is required" 
          });
          return;
        }
        if (!values.last_name) {
          form.setError("last_name", { 
            type: "manual", 
            message: "Last name is required" 
          });
          return;
        }
      }

      const { data, error } = await supabase
        .from('Customers')
        .insert([
          {
            ...values,
            shop_id: shopId,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Customer created:", data);

      toast({
        title: "Success",
        description: "Customer created successfully",
      });

      form.reset();
      onSuccess?.();

      if (data) {
        navigate(`/customer/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create customer. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Create New Customer</h2>
        <p className="text-sm text-gray-500">Add a new customer to your shop</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4 pb-6 pl-1 pr-3">
            <PersonalInfoFields form={form} />
            <AddressFields form={form} />
          </div>
          
          <div className="pt-4 border-t sticky bottom-0 bg-background mt-4 pb-2">
            <Button 
              type="submit" 
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Creating..." : "Create Customer"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
