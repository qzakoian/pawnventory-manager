
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IdentifierFieldsProps {
  imei: string;
  sku: string;
  onImeiChange: (imei: string) => void;
  onSkuChange: (sku: string) => void;
  onGenerateImei: () => void;
  onGenerateSku: () => void;
}

export const IdentifierFields = ({
  imei,
  sku,
  onImeiChange,
  onSkuChange,
  onGenerateImei,
  onGenerateSku,
}: IdentifierFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="imei">IMEI</Label>
        <div className="flex gap-2">
          <Input
            id="imei"
            value={imei}
            onChange={(e) => onImeiChange(e.target.value)}
            placeholder="Enter IMEI"
          />
          <Button type="button" variant="outline" onClick={onGenerateImei} className="shrink-0">
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
            onChange={(e) => onSkuChange(e.target.value)}
            placeholder="Enter SKU"
          />
          <Button type="button" variant="outline" onClick={onGenerateSku} className="shrink-0">
            Generate
          </Button>
        </div>
      </div>
    </div>
  );
};
