
import { BasicFields } from "./BasicFields";
import { CategoryField } from "./CategoryField";
import { CustomerField } from "./CustomerField";
import { PriceField } from "./PriceField";
import { EditProductFormProps, editProductSchema } from "./types";

export { editProductSchema };

export const EditProductFormFields = ({ form, categories, customers }: EditProductFormProps) => {
  return (
    <>
      <BasicFields form={form} />
      <CategoryField form={form} categories={categories} />
      <CustomerField form={form} customers={customers} />
      <PriceField form={form} />
    </>
  );
};
