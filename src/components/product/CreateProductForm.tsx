
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NewProduct } from "@/types/customer";
import { Button } from "../ui/button";

const formSchema = z.object({
  model: z.string().min(2, {
    message: "Model must be at least 2 characters.",
  }),
  brand: z.string().min(1, {
    message: "Brand is required.",
  }),
  product_category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  scheme: z.string().min(2, {
    message: "Scheme must be at least 2 characters.",
  }),
  purchase_price_including_VAT: z.number(),
  purchase_date: z.string(),
})

interface CreateProductFormProps {
  onSubmit: (data: NewProduct) => void;
}

export function CreateProductForm({ onSubmit }: CreateProductFormProps) {
  const [schemes, setSchemes] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchSchemes = async () => {
      const { data } = await supabase
        .from('Product Schemes')
        .select('name')
        .order('name');
      
      if (data) {
        setSchemes(data.map(scheme => scheme.name || "").filter(Boolean));
      }
    };

    const fetchBrands = async () => {
      const { data } = await supabase
        .from('Brands')
        .select('name')
        .order('name');
      
      if (data) {
        setBrands(data.map(brand => brand.name));
      }
    };

    fetchSchemes();
    fetchBrands();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "",
      brand: "",
      product_category: "",
      scheme: "",
      purchase_price_including_VAT: 0,
      purchase_date: new Date().toISOString().split('T')[0],
    },
  })

  function onSubmitForm(values: z.infer<typeof formSchema>) {
    onSubmit({
      model: values.model,
      brand: values.brand,
      product_category: values.product_category,
      scheme: values.scheme,
      purchase_price_including_VAT: values.purchase_price_including_VAT,
      purchase_date: values.purchase_date,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="iPhone 14" {...field} />
              </FormControl>
              <FormDescription>
                This is the product model.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Input placeholder="Mobile Phone" {...field} />
              </FormControl>
              <FormDescription>
                This is the product category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="scheme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Scheme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a scheme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schemes.map((scheme) => (
                    <SelectItem key={scheme} value={scheme}>
                      {scheme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <Input type="number" placeholder="100" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormDescription>
                This is the price of the product.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="purchase_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                This is the date the product was purchased.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
