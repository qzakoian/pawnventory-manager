
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Customer, EditCustomer } from "@/types/customer";
import { createCustomerSchema, type CreateCustomerFormData } from "./schemas/customerSchema";
import { PersonalInfoFields } from "./form-sections/PersonalInfoFields";
import { AddressFields } from "./form-sections/AddressFields";

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
  const form = useForm<CreateCustomerFormData>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      gender: "Prefer not to say",
      address_line1: "",
      address_line2: "",
      city: "",
      postal_code: "",
      county: "",
    },
  });

  useEffect(() => {
    if (customer) {
      form.reset({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        phone_number: customer.phone_number || "",
        email: customer.email || "",
        gender: customer.gender || "Prefer not to say",
        address_line1: customer.address_line1 || "",
        address_line2: customer.address_line2 || "",
        city: customer.city || "",
        postal_code: customer.postal_code || "",
        county: customer.county || "",
      });
    }
  }, [customer, form]);

  const handleSubmit = (values: CreateCustomerFormData) => {
    // Convert nullable values to empty strings to match EditCustomer type
    const editedCustomer: EditCustomer = {
      first_name: values.first_name || "",
      last_name: values.last_name || "",
      email: values.email || "",
      phone_number: values.phone_number || "",
      gender: values.gender || "Prefer not to say",
      address_line1: values.address_line1 || "",
      address_line2: values.address_line2 || "",
      city: values.city || "",
      postal_code: values.postal_code || "",
      county: values.county || "",
    };
    
    onSave(editedCustomer);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit Customer Profile</SheetTitle>
          <SheetDescription>
            Update the customer's information
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <PersonalInfoFields form={form} />
            <AddressFields form={form} />
            <SheetFooter className="mt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">
                Update Profile
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
