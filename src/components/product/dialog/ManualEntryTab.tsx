
import { NewProduct } from "@/types/customer";
import { ProductBasicFields } from "@/components/customer-profile/add-product/ProductBasicFields";
import { BuybackFields } from "@/components/customer-profile/add-product/BuybackFields";
import { IdentifierFields } from "@/components/customer-profile/add-product/IdentifierFields";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ManualEntryTabProps {
  newProduct: NewProduct;
  setNewProduct: React.Dispatch<React.SetStateAction<NewProduct>>;
  buybackRate: number;
  setBuybackRate: (rate: number) => void;
  buybackPrice: number;
  setBuybackPrice: (price: number) => void;
  imei: string;
  setImei: (imei: string) => void;
  sku: string;
  setSku: (sku: string) => void;
  brands: string[];
  categories: string[];
  schemes: string[];
  generateRandomIMEI: () => Promise<void>;
  generateRandomSKU: () => Promise<void>;
}

export const ManualEntryTab = ({
  newProduct,
  setNewProduct,
  buybackRate,
  setBuybackRate,
  buybackPrice,
  setBuybackPrice,
  imei,
  setImei,
  sku,
  setSku,
  brands,
  categories,
  schemes,
  generateRandomIMEI,
  generateRandomSKU,
}: ManualEntryTabProps) => {
  const isBuybackScheme = newProduct.scheme.includes('buy-back');

  return (
    <div className="space-y-4">
      <ProductBasicFields
        newProduct={newProduct}
        onProductChange={setNewProduct}
        brands={brands}
        categories={categories}
        schemes={schemes}
      />
      <div className="space-y-2">
        <Label htmlFor="purchase_price">Purchase Price (inc. VAT)</Label>
        <Input
          id="purchase_price"
          type="number"
          value={newProduct.purchase_price_including_VAT}
          onChange={(e) => setNewProduct({ ...newProduct, purchase_price_including_VAT: parseFloat(e.target.value) })}
        />
      </div>
      {isBuybackScheme && (
        <BuybackFields
          buybackRate={buybackRate}
          buybackPrice={buybackPrice}
          onBuybackRateChange={setBuybackRate}
          onBuybackPriceChange={setBuybackPrice}
          purchasePrice={newProduct.purchase_price_including_VAT}
        />
      )}
      <IdentifierFields
        imei={imei}
        sku={sku}
        onImeiChange={setImei}
        onSkuChange={setSku}
        onGenerateImei={generateRandomIMEI}
        onGenerateSku={generateRandomSKU}
      />
      <div className="space-y-2">
        <Label htmlFor="purchase_date">Purchase Date</Label>
        <Input
          id="purchase_date"
          type="date"
          value={newProduct.purchase_date}
          onChange={(e) => setNewProduct({ ...newProduct, purchase_date: e.target.value })}
        />
      </div>
    </div>
  );
};
