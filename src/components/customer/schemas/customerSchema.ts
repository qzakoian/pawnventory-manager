
import * as z from "zod";

export const createCustomerSchema = z.object({
  customer_type: z.enum(["individual", "company"]).default("individual"),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  vat_number: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone_number: z.string().optional().nullable(),
  gender: z.enum(["Male", "Female", "Prefer not to say"]).default("Prefer not to say").optional().nullable(),
  address_line1: z.string().optional().nullable(),
  address_line2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
});

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
