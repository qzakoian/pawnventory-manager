
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
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address_line1: "",
      address_line2: "",
      city: "",
      postal_code: "",
      county: "",
    },
  });

  const onSubmit = async (values: CreateCustomerFormData) => {
    try {
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

      if (error) throw error;

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
        description: "Failed to create customer",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Create New Customer</h2>
        <p className="text-sm text-gray-500">Add a new customer to your shop</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <PersonalInfoFields form={form} />
          <AddressFields form={form} />
          <Button type="submit" className="w-full mt-6">Create Customer</Button>
        </form>
      </Form>
    </div>
  );
};
