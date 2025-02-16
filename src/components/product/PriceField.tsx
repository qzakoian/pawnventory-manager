
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditProductFormProps } from "./types";

export const PriceField = ({ form }: EditProductFormProps) => {
  return (
    <FormField
      control={form.control}
      name="purchase_price_including_VAT"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Purchase Price (inc. VAT)</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              {...field} 
              onChange={e => field.onChange(parseFloat(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
