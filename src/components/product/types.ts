
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

export interface ProductCategory {
  name: string | null;
}

export interface Customer {
  id: number;
  first_name: string | null;
  last_name: string | null;
}

export const editProductSchema = z.object({
  model: z.string().min(1, "Model is required"),
  imei: z.string().optional(),
  sku: z.string().optional(),
  product_category: z.string().min(1, "Category is required"),
  purchase_price_including_VAT: z.number().min(0, "Price must be positive"),
  customer_id: z.string().optional(),
});

export interface EditProductFormProps {
  form: UseFormReturn<z.infer<typeof editProductSchema>>;
  categories?: ProductCategory[];
  customers?: Customer[];
}
