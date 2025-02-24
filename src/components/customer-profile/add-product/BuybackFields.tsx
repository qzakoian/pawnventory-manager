
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BuybackFieldsProps {
  buybackRate: number;
  buybackPrice: number;
  onBuybackRateChange: (rate: number) => void;
  onBuybackPriceChange: (price: number) => void;
}

export const BuybackFields = ({
  buybackRate,
  buybackPrice,
  onBuybackRateChange,
  onBuybackPriceChange,
}: BuybackFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="buyback_rate">Interest Rate [%]</Label>
        <Input
          id="buyback_rate"
          type="number"
          value={buybackRate}
          onChange={(e) => onBuybackRateChange(parseFloat(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="buyback_price">Buy-back Price</Label>
        <Input
          id="buyback_price"
          type="number"
          value={buybackPrice}
          onChange={(e) => onBuybackPriceChange(parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};
