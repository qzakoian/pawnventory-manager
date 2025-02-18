
import * as z from "zod";

export const createCustomerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  address_line1: z.string().optional().nullable(),
  address_line2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
});

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
