
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const editProductSchema = z.object({
  model: z.string().min(1, "Model is required"),
  imei: z.string().optional(),
  sku: z.string().optional(),
  product_category: z.string().min(1, "Category is required"),
  purchase_price_including_VAT: z.number().min(0, "Price must be positive"),
});

interface EditProductFormProps {
  product: {
    id: number;
    model: string | null;
    imei: string | null;
    sku: string | null;
    product_category: string | null;
    purchase_price_including_VAT: number | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditProductForm = ({ product, isOpen, onClose, onSuccess }: EditProductFormProps) => {
  const { toast } = useToast();

  const { data: categories } = useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Product Categories')
        .select('name')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      model: product.model || "",
      imei: product.imei || "",
      sku: product.sku || "",
      product_category: product.product_category || "",
      purchase_price_including_VAT: product.purchase_price_including_VAT || 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof editProductSchema>) => {
    try {
      console.log('Submitting values:', values); // Debug log

      // Clean up the values before sending to Supabase
      const updateData = {
        ...values,
        purchase_price_including_VAT: Number(values.purchase_price_including_VAT),
        // Handle optional fields
        imei: values.imei || null,
        sku: values.sku || null,
      };

      console.log('Sending to Supabase:', updateData); // Debug log
      
      const { data, error } = await supabase
        .from('Products')
        .update(updateData)
        .eq('id', product.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error); // Debug log
        throw error;
      }

      console.log('Update successful:', data); // Debug log

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imei"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMEI (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem 
                            key={category.name} 
                            value={category.name || ""}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button type="submit" className="w-full">Update Product</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
