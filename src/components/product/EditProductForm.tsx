
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { EditProductFormFields, editProductSchema } from "./EditProductFormFields";
import * as z from "zod";

interface EditProductFormProps {
  product: {
    id: number;
    model: string | null;
    imei: string | null;
    sku: string | null;
    product_category: string | null;
    purchase_price_including_VAT: number | null;
    customer_id: number | null;
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

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Customers')
        .select('id, first_name, last_name')
        .order('first_name');
      
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
      customer_id: product.customer_id ? String(product.customer_id) : undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof editProductSchema>) => {
    try {
      console.log('Submitting values:', values);

      const updateData = {
        ...values,
        purchase_price_including_VAT: Number(values.purchase_price_including_VAT),
        imei: values.imei || null,
        sku: values.sku || null,
        customer_id: values.customer_id ? Number(values.customer_id) : null,
      };

      console.log('Sending to Supabase:', updateData);
      
      const { data, error } = await supabase
        .from('Products')
        .update(updateData)
        .eq('id', product.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Update successful:', data);

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
            <EditProductFormFields 
              form={form}
              categories={categories}
              customers={customers}
            />
            <Button type="submit" className="w-full">Update Product</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
