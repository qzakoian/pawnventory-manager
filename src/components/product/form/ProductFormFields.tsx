
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormFieldsProps {
  model: string;
  setModel: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  scheme: string;
  setScheme: (value: string) => void;
  purchaseDate: string;
  setPurchaseDate: (value: string) => void;
  purchasePrice: number;
  setPurchasePrice: (value: number) => void;
  buybackRate: number;
  setBuybackRate: (value: number) => void;
  buybackPrice: number;
  setBuybackPrice: (value: number) => void;
  imei: string;
  setImei: (value: string) => void;
  sku: string;
  setSku: (value: string) => void;
}

export const ProductFormFields = ({
  model,
  setModel,
  category,
  setCategory,
  scheme,
  setScheme,
  purchaseDate,
  setPurchaseDate,
  purchasePrice,
  setPurchasePrice,
  buybackRate,
  setBuybackRate,
  buybackPrice,
  setBuybackPrice,
  imei,
  setImei,
  sku,
  setSku,
}: ProductFormFieldsProps) => {
  const generateRandomIMEI = async () => {
    const { data, error } = await supabase.rpc('generate_random_imei');
    if (!error && data) {
      setImei(data);
    }
  };

  const generateRandomSKU = async () => {
    const { data, error } = await supabase.rpc('generate_random_sku');
    if (!error && data) {
      setSku(data);
    }
  };

  const isBuybackScheme = scheme.includes('buy-back');

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Enter model name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheme">Scheme</Label>
        <Select value={scheme} onValueChange={setScheme}>
          <SelectTrigger>
            <SelectValue placeholder="Select a scheme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="28-day-buy-back">28 Day Buy-back</SelectItem>
            <SelectItem value="12-week-buy-back">12 Week Buy-back</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchase_date">Purchase Date</Label>
        <Input
          id="purchase_date"
          type="date"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchase_price">Purchase Price (inc. VAT)</Label>
        <Input
          id="purchase_price"
          type="number"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
          placeholder="Enter purchase price"
        />
      </div>

      {isBuybackScheme && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="buyback_rate">Interest Rate [%]</Label>
            <Input
              id="buyback_rate"
              type="number"
              value={buybackRate}
              onChange={(e) => setBuybackRate(parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="buyback_price">Buy-back Price (inc. VAT)</Label>
            <Input
              id="buyback_price"
              type="number"
              value={buybackPrice}
              onChange={(e) => setBuybackPrice(parseFloat(e.target.value))}
            />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="imei">IMEI</Label>
          <div className="flex gap-2">
            <Input
              id="imei"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              placeholder="Enter IMEI"
            />
            <Button type="button" variant="outline" onClick={generateRandomIMEI} className="shrink-0">
              Generate
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <div className="flex gap-2">
            <Input
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Enter SKU"
            />
            <Button type="button" variant="outline" onClick={generateRandomSKU} className="shrink-0">
              Generate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
