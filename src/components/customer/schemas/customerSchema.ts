
import * as z from "zod";

export const createCustomerSchema = z.object({
  customer_type: z.enum(["individual", "company"]).default("individual"),
  first_name: z.string().min(1, "First name is required").optional().nullable(),
  last_name: z.string().min(1, "Last name is required").optional().nullable(),
  company_name: z.string().min(1, "Company name is required").optional().nullable(),
  vat_number: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  gender: z.enum(["Male", "Female", "Prefer not to say"]).default("Prefer not to say").optional().nullable(),
  address_line1: z.string().optional().nullable(),
  address_line2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
}).refine((data) => {
  // For individual customers, first_name and last_name are required
  if (data.customer_type === "individual") {
    return data.first_name && data.last_name;
  }
  
  // For company customers, company_name is required
  if (data.customer_type === "company") {
    return !!data.company_name;
  }
  
  return true;
}, {
  message: "Required fields missing for the selected customer type",
  path: ["customer_type"]
});

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
