
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NewProduct } from "@/types/customer";

interface ModelFieldProps {
  model: string;
  onChange: (value: string) => void;
}

export const ModelField = ({ model, onChange }: ModelFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="model">Model</Label>
      <Input
        id="model"
        value={model}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
