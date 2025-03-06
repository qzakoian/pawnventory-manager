
import { NewProduct } from "@/types/customer";
import { ModelField } from "./fields/ModelField";
import { BrandField } from "./fields/BrandField";
import { CategoryField } from "./fields/CategoryField";
import { SchemeField } from "./fields/SchemeField";

interface ProductBasicFieldsProps {
  newProduct: NewProduct;
  onProductChange: (product: NewProduct) => void;
  brands: string[];
  categories: string[];
  schemes: string[];
}

export const ProductBasicFields = ({
  newProduct,
  onProductChange,
  brands = [],
  categories,
  schemes,
}: ProductBasicFieldsProps) => {
  const handleModelChange = (model: string) => {
    onProductChange({ ...newProduct, model });
  };

  const handleBrandChange = (brand: string) => {
    onProductChange({ ...newProduct, brand });
  };

  const handleCategoryChange = (product_category: string) => {
    onProductChange({ ...newProduct, product_category });
  };

  const handleSchemeChange = (scheme: string) => {
    onProductChange({ ...newProduct, scheme });
  };

  return (
    <>
      <ModelField
        model={newProduct.model}
        onChange={handleModelChange}
      />
      <BrandField
        brand={newProduct.brand}
        onChange={handleBrandChange}
        brands={brands}
      />
      <CategoryField
        category={newProduct.product_category}
        onChange={handleCategoryChange}
        categories={categories}
      />
      <SchemeField
        scheme={newProduct.scheme}
        onChange={handleSchemeChange}
        schemes={schemes}
      />
    </>
  );
};
