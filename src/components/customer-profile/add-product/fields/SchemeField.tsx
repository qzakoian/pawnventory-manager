
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SchemeFieldProps {
  scheme: string;
  onChange: (value: string) => void;
  schemes: string[];
}

export const SchemeField = ({ scheme, onChange, schemes }: SchemeFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="scheme">Scheme</Label>
      <Select
        value={scheme}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select scheme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Schemes</SelectLabel>
            {schemes.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
